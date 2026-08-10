/**
 * Генерирует supabase/seed.sql из data/properties.ts —
 * для применения через SQL Editor, когда прямой доступ к БД недоступен.
 * Запуск: npx tsx scripts/generate-seed-sql.ts
 */
import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { properties } from "../data/properties";

function q(s: string | null | undefined): string {
  if (s === null || s === undefined) return "null";
  return "'" + String(s).replace(/'/g, "''") + "'";
}

function normalizePhone(p: string): string {
  const digits = p.replace(/[^0-9+]/g, "");
  return digits.startsWith("+") ? digits : "+" + digits;
}

const lines: string[] = [];
lines.push("-- IK-HOUSE demo seed (сгенерировано из data/properties.ts)");
lines.push("-- Запускать ПОСЛЕ 0001_init.sql. Повторный запуск обновит объекты по slug.");
lines.push("begin;");

// --- владельцы ---
const ownerIds = new Map<string, { userId: string; ownerId: string }>();
for (const p of properties) {
  if (ownerIds.has(p.owner.name)) continue;
  const userId = randomUUID();
  const ownerId = randomUUID();
  ownerIds.set(p.owner.name, { userId, ownerId });
  const email = `demo.owner.${ownerIds.size}@ik-house.dev`;

  lines.push(`
-- Владелец: ${p.owner.name}
insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token)
select '00000000-0000-0000-0000-000000000000', '${userId}', 'authenticated', 'authenticated',
  ${q(email)}, crypt(gen_random_uuid()::text, gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}',
  ${q(JSON.stringify({ first_name: p.owner.name, last_name: "(Demo)" }))}::jsonb,
  now(), now(), '', '', '', ''
where not exists (select 1 from auth.users where email = ${q(email)});

insert into public.owner_profiles (id, user_id, owner_type, display_name, whatsapp,
  public_phone, avatar_url, show_public_contact, verification_status, reviewed_at)
select '${ownerId}', u.id, 'individual', ${q(p.owner.name)}, ${q(p.owner.whatsapp)},
  ${q(normalizePhone(p.owner.phone))}, ${q(p.owner.avatar || null)}, true, 'verified', now()
from auth.users u
where u.email = ${q(email)}
on conflict (user_id) do nothing;`);
}

// --- объекты ---
for (const p of properties) {
  const owner = ownerIds.get(p.owner.name)!;
  const propId = randomUUID();
  lines.push(`
-- Объект: ${p.title}
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('${propId}',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = ${q(p.owner.name)} limit 1),
  ${q(p.slug)}, ${q(p.title)}, '${p.type}', ${q(p.description)}, '${p.shore}',
  ${q(p.location)}, ${q(p.address)}, ${p.coordinates.lat}, ${p.coordinates.lng},
  ${p.distanceToBeach}, ${p.guests}, ${p.bedrooms}, ${p.beds}, ${p.bathrooms},
  ${p.pricePerNight}, ${p.oldPrice ?? "null"}, ${p.rating}, ${p.reviewsCount},
  ${p.featured}, ${p.popular}, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());
`);

  // изображения
  lines.push(`delete from public.property_images where property_id = (select id from public.properties where slug = ${q(p.slug)});`);
  p.images.forEach((url, i) => {
    lines.push(
      `insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = ${q(p.slug)}), ${q(url)}, ${i}, ${i === 0});`,
    );
  });

  // удобства
  lines.push(`delete from public.property_amenities where property_id = (select id from public.properties where slug = ${q(p.slug)});`);
  for (const a of p.amenities) {
    lines.push(
      `insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = ${q(p.slug)}), '${a}');`,
    );
  }

  // занятые даты
  if (p.blockedDates?.length) {
    for (const d of p.blockedDates) {
      lines.push(
        `insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = ${q(p.slug)}), '${d}', 'blocked') on conflict (property_id, date) do nothing;`,
      );
    }
  }

  // отзывы
  lines.push(`delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = ${q(p.slug)});`);
  for (const r of p.reviews ?? []) {
    lines.push(
      `insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = ${q(p.slug)}), ${q(r.name)}, ${q(r.city)}, ${Math.round(r.rating)}, ${q(r.text)}, 'published', ${q(r.date + "T12:00:00Z")});`,
    );
  }
}

lines.push("commit;");
lines.push("select count(*) as properties_seeded from public.properties where status = 'published';");

writeFileSync("supabase/seed.sql", lines.join("\n"));
console.log("✅ supabase/seed.sql создан:", lines.length, "строк");
