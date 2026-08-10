/**
 * IK-HOUSE — перенос demo-объектов (data/properties.ts) в Supabase.
 *
 * Запуск:  npm run seed
 * Требует: NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в .env.local
 *
 * Скрипт идемпотентен: повторный запуск обновляет объекты по slug,
 * не создавая дубликатов.
 */
import { createClient } from "@supabase/supabase-js";
import { loadEnv, requireEnv } from "./env";
import { properties } from "../data/properties";

loadEnv();

const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

const OWNER_PASSWORD = "Demo-Owner-" + Math.random().toString(36).slice(2, 10);

async function ensureOwner(ownerName: string, phone: string, whatsapp: string, avatar: string) {
  const email = `demo.owner.${slugify(ownerName)}@ik-house.dev`;

  // ищем существующего пользователя
  const { data: existing } = await db
    .from("owner_profiles")
    .select("id, user_id, display_name")
    .eq("display_name", ownerName)
    .maybeSingle();
  if (existing) return existing.id as string;

  const { data: created, error: userErr } = await db.auth.admin.createUser({
    email,
    password: OWNER_PASSWORD,
    email_confirm: true,
    user_metadata: { first_name: ownerName, last_name: "(Demo)" },
  });

  let userId: string;
  if (userErr) {
    // возможно, уже существует — найдём по email
    const { data: list } = await db.auth.admin.listUsers({ perPage: 1000 });
    const u = list?.users.find((x) => x.email === email);
    if (!u) throw userErr;
    userId = u.id;
  } else {
    userId = created.user!.id;
  }

  // профиль создаётся триггером; дождёмся и обновим телефон
  await db
    .from("profiles")
    .update({ phone: normalizePhone(phone) })
    .eq("id", userId);

  const { data: op, error: opErr } = await db
    .from("owner_profiles")
    .insert({
      user_id: userId,
      owner_type: "individual",
      display_name: ownerName,
      whatsapp,
      public_phone: phone,
      avatar_url: avatar || null,
      show_public_contact: true,
      verification_status: "verified",
      reviewed_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (opErr) throw opErr;
  return op.id as string;
}

function slugify(s: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z", и: "i",
    й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s",
    т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
    ы: "y", э: "e", ю: "yu", я: "ya", ь: "", ъ: "",
  };
  return s
    .toLowerCase()
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizePhone(p: string): string {
  const digits = p.replace(/[^0-9+]/g, "");
  return digits.startsWith("+") ? digits : "+" + digits;
}

function reviewDateToISO(d: string): string {
  // "2025-07-18" -> ISO
  return new Date(d + "T12:00:00Z").toISOString();
}

async function main() {
  console.log("🌱 IK-HOUSE seed: переносим demo-объекты в Supabase…\n");

  // 1) Владельцы
  const ownerIds = new Map<string, string>();
  for (const p of properties) {
    if (!ownerIds.has(p.owner.name)) {
      const id = await ensureOwner(
        p.owner.name,
        p.owner.phone,
        p.owner.whatsapp,
        p.owner.avatar,
      );
      ownerIds.set(p.owner.name, id);
      console.log(`  👤 Владелец: ${p.owner.name}`);
    }
  }

  // 2) Объекты
  let created = 0;
  let updated = 0;
  for (const p of properties) {
    const ownerId = ownerIds.get(p.owner.name)!;
    const row = {
      owner_id: ownerId,
      slug: p.slug,
      title: p.title,
      type: p.type,
      description: p.description,
      shore: p.shore,
      location: p.location,
      address: p.address,
      latitude: p.coordinates.lat,
      longitude: p.coordinates.lng,
      distance_to_beach: p.distanceToBeach,
      max_guests: p.guests,
      bedrooms: p.bedrooms,
      beds: p.beds,
      bathrooms: p.bathrooms,
      price_per_night: p.pricePerNight,
      old_price: p.oldPrice ?? null,
      rating: p.rating,
      reviews_count: p.reviewsCount,
      featured: p.featured,
      popular: p.popular,
      status: "published",
      published_at: new Date().toISOString(),
    };

    const { data: existing } = await db
      .from("properties")
      .select("id")
      .eq("slug", p.slug)
      .maybeSingle();

    let propertyId: string;
    if (existing) {
      const { error } = await db
        .from("properties")
        .update(row)
        .eq("id", existing.id);
      if (error) throw error;
      propertyId = existing.id as string;
      updated++;
    } else {
      const { data: ins, error } = await db
        .from("properties")
        .insert(row)
        .select("id")
        .single();
      if (error) throw error;
      propertyId = ins.id as string;
      created++;
    }

    // фотографии
    await db.from("property_images").delete().eq("property_id", propertyId);
    if (p.images.length) {
      const { error } = await db.from("property_images").insert(
        p.images.map((url, i) => ({
          property_id: propertyId,
          url,
          sort_order: i,
          is_cover: i === 0,
        })),
      );
      if (error) throw error;
    }

    // удобства
    await db.from("property_amenities").delete().eq("property_id", propertyId);
    if (p.amenities.length) {
      const { error } = await db.from("property_amenities").insert(
        p.amenities.map((a) => ({ property_id: propertyId, amenity_key: a })),
      );
      if (error) throw error;
    }

    // занятые даты
    await db
      .from("property_availability")
      .delete()
      .eq("property_id", propertyId)
      .eq("status", "blocked");
    if (p.blockedDates?.length) {
      const { error } = await db.from("property_availability").upsert(
        p.blockedDates.map((date) => ({
          property_id: propertyId,
          date,
          status: "blocked",
        })),
        { onConflict: "property_id,date" },
      );
      if (error) throw error;
    }

    // отзывы (demo)
    await db
      .from("reviews")
      .delete()
      .eq("property_id", propertyId)
      .is("user_id", null);
    if (p.reviews?.length) {
      const { error } = await db.from("reviews").insert(
        p.reviews.map((r) => ({
          property_id: propertyId,
          author_name: r.name,
          author_city: r.city,
          rating: Math.round(r.rating),
          text: r.text,
          status: "published",
          created_at: reviewDateToISO(r.date),
        })),
      );
      if (error) throw error;
    }

    console.log(`  🏠 ${p.title} (${existing ? "обновлён" : "создан"})`);
  }

  console.log(`\n✅ Готово: создано ${created}, обновлено ${updated} объектов.`);
  console.log(
    "\nDemo-владельцы: demo.owner.*@ik-house.dev (пароль в этой сессии: " +
      OWNER_PASSWORD +
      " — используется только при первом создании).",
  );
  console.log(
    "Создать администратора: npm run create-admin -- your-email@example.com",
  );
}

main().catch((e) => {
  console.error("❌ Seed завершился с ошибкой:", e);
  process.exit(1);
});
