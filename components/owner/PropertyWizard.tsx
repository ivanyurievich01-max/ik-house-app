"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Minus,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Camera,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uniqueSlug } from "@/lib/slug";
import { compressImage } from "@/lib/image";
import {
  AMENITY_LABELS,
  LOCATIONS,
  SHORE_LABELS,
  TYPE_LABELS,
} from "@/lib/constants";
import { cn, formatSom, toISODate } from "@/lib/utils";
import type { Amenity, PropertyType, Shore } from "@/types/property";

const STEPS = [
  "Основное",
  "Расположение",
  "Характеристики",
  "Удобства",
  "Фотографии",
  "Цена",
  "Календарь",
  "Проверка",
] as const;

export type WizardImage = {
  id?: string;
  url: string;
  sort_order: number;
};

export type WizardData = {
  id: string | null;
  status: string;
  title: string;
  type: PropertyType;
  description: string;
  shore: Shore;
  location: string;
  address: string;
  distanceToBeach: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  area: string;
  amenities: Amenity[];
  images: WizardImage[];
  price: string;
  oldPrice: string;
  blockedDates: string[];
};

export function emptyWizardData(): WizardData {
  return {
    id: null,
    status: "draft",
    title: "",
    type: "cottage",
    description: "",
    shore: "north",
    location: LOCATIONS[0],
    address: "",
    distanceToBeach: "",
    maxGuests: 4,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    area: "",
    amenities: ["wifi"],
    images: [],
    price: "",
    oldPrice: "",
    blockedDates: [],
  };
}

const TYPE_OPTIONS = Object.keys(TYPE_LABELS) as PropertyType[];
const AMENITY_OPTIONS = Object.keys(AMENITY_LABELS) as Amenity[];

function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 50,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex min-h-12 items-center justify-between rounded-xl border border-slate-200 px-4 py-2.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Уменьшить: ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-ink-soft disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-6 text-center font-bold text-ink">{value}</span>
        <button
          type="button"
          aria-label={`Увеличить: ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-ink-soft disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function PropertyWizard({
  initial,
  userId,
}: {
  initial: WizardData;
  userId: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<WizardData>(initial);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(0);
  const [done, setDone] = useState<null | "moderation" | "draft" | "saved">(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [calCursor, setCalCursor] = useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });

  const set = useCallback(<K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
  }, []);

  function validateStep(s: number): string {
    if (s === 0) {
      if (data.title.trim().length < 3) return "Укажите название объекта";
      if (data.description.trim().length < 30)
        return "Опишите объект подробнее (минимум 30 символов)";
    }
    if (s === 1) {
      if (!data.location.trim()) return "Укажите населённый пункт";
    }
    if (s === 5) {
      const p = parseInt(data.price, 10);
      if (!p || p < 100) return "Укажите цену за ночь (минимум 100 сом)";
    }
    return "";
  }

  /** Сохраняет текущие данные в БД (создаёт черновик при первом сохранении) */
  async function persist(): Promise<string | null> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Сессия истекла. Войдите заново.");
      return null;
    }

    const price = parseInt(data.price, 10);
    const row = {
      title: data.title.trim() || "Без названия",
      type: data.type,
      description: data.description.trim(),
      shore: data.shore,
      location: data.location.trim(),
      address: data.address.trim(),
      distance_to_beach: parseInt(data.distanceToBeach, 10) || null,
      max_guests: data.maxGuests,
      bedrooms: data.bedrooms,
      beds: data.beds,
      bathrooms: data.bathrooms,
      area: parseInt(data.area, 10) || null,
      price_per_night: Number.isFinite(price) && price > 0 ? price : 100,
      old_price: parseInt(data.oldPrice, 10) || null,
    };

    if (!data.id) {
      // первый раз — создаём черновик
      const { data: ownerRow } = await supabase
        .from("owner_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!ownerRow) {
        setError("Профиль владельца не найден");
        return null;
      }
      const { data: ins, error: insErr } = await supabase
        .from("properties")
        .insert({
          ...row,
          owner_id: ownerRow.id,
          slug: uniqueSlug(data.title),
          status: "draft",
        })
        .select("id")
        .single();
      if (insErr) {
        setError("Не удалось сохранить черновик");
        return null;
      }
      set("id", ins.id as string);
      return ins.id as string;
    }

    const { error: upErr } = await supabase
      .from("properties")
      .update(row)
      .eq("id", data.id);
    if (upErr) {
      setError("Не удалось сохранить изменения");
      return null;
    }
    return data.id;
  }

  async function saveAmenities(propertyId: string) {
    const supabase = createClient();
    await supabase.from("property_amenities").delete().eq("property_id", propertyId);
    if (data.amenities.length) {
      await supabase.from("property_amenities").insert(
        data.amenities.map((a) => ({ property_id: propertyId, amenity_key: a })),
      );
    }
  }

  async function next() {
    const v = validateStep(step);
    if (v) {
      setError(v);
      return;
    }
    setError("");
    setSaving(true);
    const id = await persist();
    if (id && step === 3) await saveAmenities(id);
    setSaving(false);
    if (!id) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0 });
  }

  function back() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0 });
  }

  // ---------- Фото ----------
  async function handleFiles(files: FileList) {
    if (!data.id) {
      const id = await persist();
      if (!id) return;
    }
    const propertyId = data.id!;
    const supabase = createClient();
    const list = Array.from(files).slice(0, 30 - data.images.length);
    if (!list.length) return;
    setError("");

    for (const file of list) {
      setUploading((u) => u + 1);
      try {
        const blob = await compressImage(file);
        const path = `${userId}/${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.jpg`;
        const { error: upErr } = await supabase.storage
          .from("property-images")
          .upload(path, blob, { contentType: "image/jpeg" });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage
          .from("property-images")
          .getPublicUrl(path);

        const sort = data.images.length;
        const { data: imgRow, error: imgErr } = await supabase
          .from("property_images")
          .insert({
            property_id: propertyId,
            url: pub.publicUrl,
            sort_order: sort,
            is_cover: sort === 0,
          })
          .select("id, url, sort_order")
          .single();
        if (imgErr) throw imgErr;

        setData((d) => ({
          ...d,
          images: [
            ...d.images,
            { id: imgRow.id as string, url: imgRow.url as string, sort_order: d.images.length },
          ],
        }));
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Не удалось загрузить фотографию",
        );
      } finally {
        setUploading((u) => u - 1);
      }
    }
  }

  async function syncImageOrder(images: WizardImage[]) {
    const supabase = createClient();
    await Promise.all(
      images.map((img, i) =>
        supabase
          .from("property_images")
          .update({ sort_order: i, is_cover: i === 0 })
          .eq("id", img.id),
      ),
    );
  }

  async function removeImage(idx: number) {
    const img = data.images[idx];
    const nextImages = data.images.filter((_, i) => i !== idx);
    setData((d) => ({ ...d, images: nextImages }));
    const supabase = createClient();
    if (img.id) await supabase.from("property_images").delete().eq("id", img.id);
    await syncImageOrder(nextImages);
  }

  async function moveImage(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= data.images.length) return;
    const arr = [...data.images];
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    setData((d) => ({ ...d, images: arr }));
    await syncImageOrder(arr);
  }

  async function makeCover(idx: number) {
    if (idx === 0) return;
    const arr = [data.images[idx], ...data.images.filter((_, i) => i !== idx)];
    setData((d) => ({ ...d, images: arr }));
    await syncImageOrder(arr);
  }

  // ---------- Календарь ----------
  function toggleDate(iso: string) {
    setData((d) => ({
      ...d,
      blockedDates: d.blockedDates.includes(iso)
        ? d.blockedDates.filter((x) => x !== iso)
        : [...d.blockedDates, iso],
    }));
  }

  async function persistCalendar(propertyId: string) {
    const supabase = createClient();
    // удаляем все blocked и вставляем актуальные (booked не трогаем)
    await supabase
      .from("property_availability")
      .delete()
      .eq("property_id", propertyId)
      .eq("status", "blocked");
    if (data.blockedDates.length) {
      await supabase.from("property_availability").upsert(
        data.blockedDates.map((date) => ({
          property_id: propertyId,
          date,
          status: "blocked",
        })),
        { onConflict: "property_id,date", ignoreDuplicates: true },
      );
    }
  }

  async function finish(target: "moderation" | "draft" | "saved") {
    const v = validateStep(5);
    if (v) {
      setError(v);
      setStep(5);
      return;
    }
    if (target === "moderation" && data.images.length < 1) {
      setError("Добавьте хотя бы одну фотографию");
      setStep(4);
      return;
    }
    setSaving(true);
    setError("");
    const id = await persist();
    if (!id) {
      setSaving(false);
      return;
    }
    await saveAmenities(id);
    await persistCalendar(id);

    const supabase = createClient();
    if (target === "moderation") {
      const { error: stErr } = await supabase
        .from("properties")
        .update({ status: "pending_review" })
        .eq("id", id);
      if (stErr) {
        setError("Не удалось отправить на модерацию");
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    setDone(target);
    window.scrollTo({ top: 0 });
  }

  // ---------- Рендер шагов ----------
  const monthGrid = useMemo(() => {
    const first = new Date(calCursor.y, calCursor.m, 1);
    const startWeekday = (first.getDay() + 6) % 7; // Пн=0
    const daysInMonth = new Date(calCursor.y, calCursor.m + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(toISODate(new Date(calCursor.y, calCursor.m, d)));
    }
    return cells;
  }, [calCursor]);

  const todayIso = toISODate(new Date());

  if (done) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">
          {done === "moderation"
            ? "Отправлено на модерацию"
            : done === "draft"
              ? "Черновик сохранён"
              : "Изменения сохранены"}
        </h1>
        <p className="mt-2 text-ink-soft">
          {done === "moderation"
            ? "Администратор проверит объявление, после одобрения оно появится в каталоге. Статус можно отслеживать в «Мои объекты»."
            : "Вы можете вернуться к редактированию в любой момент в разделе «Мои объекты»."}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <button
            onClick={() => {
              router.push("/owner/properties");
              router.refresh();
            }}
            className="btn-primary justify-center"
          >
            К моим объектам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28">
      {/* Прогресс */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-ink">
            Шаг {step + 1} из {STEPS.length}: {STEPS[step]}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="card p-5 sm:p-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="wTitle">
                Название объекта
              </label>
              <input
                id="wTitle"
                className="input"
                value={data.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Например: Коттедж «Волна»"
                maxLength={80}
              />
            </div>
            <div>
              <span className="label">Тип жилья</span>
              <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TYPE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("type", t)}
                    className={cn(
                      "min-h-11 rounded-xl border px-3 py-2.5 text-sm font-medium transition",
                      data.type === t
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-slate-200 text-ink-soft hover:border-slate-300",
                    )}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label" htmlFor="wDesc">
                Описание
              </label>
              <textarea
                id="wDesc"
                className="input min-h-36"
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Расскажите гостям, чем хорош ваш объект: расположение, вид, что рядом, для кого подходит…"
                maxLength={2000}
              />
              <p className="mt-1 text-xs text-ink-muted">
                {data.description.trim().length}/2000 · минимум 30 символов
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <span className="label">Берег</span>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {(Object.keys(SHORE_LABELS) as Shore[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("shore", s)}
                    className={cn(
                      "min-h-11 rounded-xl border px-3 py-2.5 text-sm font-medium",
                      data.shore === s
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-slate-200 text-ink-soft",
                    )}
                  >
                    {SHORE_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label" htmlFor="wLoc">
                Населённый пункт
              </label>
              <select
                id="wLoc"
                className="input"
                value={LOCATIONS.includes(data.location as (typeof LOCATIONS)[number]) ? data.location : "__other"}
                onChange={(e) => {
                  if (e.target.value !== "__other") set("location", e.target.value);
                  else set("location", "");
                }}
              >
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
                <option value="__other">Другое…</option>
              </select>
              {!LOCATIONS.includes(data.location as (typeof LOCATIONS)[number]) && (
                <input
                  className="input mt-2"
                  value={data.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="Введите населённый пункт"
                />
              )}
            </div>
            <div>
              <label className="label" htmlFor="wAddr">
                Адрес <span className="text-ink-muted">(не показывается публично полностью)</span>
              </label>
              <input
                id="wAddr"
                className="input"
                value={data.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Улица, дом"
                autoComplete="street-address"
              />
            </div>
            <div>
              <label className="label" htmlFor="wDist">
                Расстояние до пляжа, метров
              </label>
              <input
                id="wDist"
                className="input"
                inputMode="numeric"
                value={data.distanceToBeach}
                onChange={(e) =>
                  set("distanceToBeach", e.target.value.replace(/\D/g, ""))
                }
                placeholder="Например: 200"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <Stepper
              label="Максимум гостей"
              value={data.maxGuests}
              onChange={(v) => set("maxGuests", v)}
              min={1}
              max={40}
            />
            <Stepper
              label="Спальни"
              value={data.bedrooms}
              onChange={(v) => set("bedrooms", v)}
              min={0}
              max={20}
            />
            <Stepper
              label="Кровати"
              value={data.beds}
              onChange={(v) => set("beds", v)}
              min={1}
              max={40}
            />
            <Stepper
              label="Санузлы"
              value={data.bathrooms}
              onChange={(v) => set("bathrooms", v)}
              min={1}
              max={10}
            />
            <div>
              <label className="label" htmlFor="wArea">
                Площадь, м² <span className="text-ink-muted">(необязательно)</span>
              </label>
              <input
                id="wArea"
                className="input"
                inputMode="numeric"
                value={data.area}
                onChange={(e) => set("area", e.target.value.replace(/\D/g, ""))}
                placeholder="Например: 120"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="mb-3 text-sm text-ink-muted">
              Отметьте всё, что есть в вашем объекте.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {AMENITY_OPTIONS.map((a) => {
                const checked = data.amenities.includes(a);
                return (
                  <label
                    key={a}
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition",
                      checked
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-slate-200 text-ink-soft",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-brand-600"
                      checked={checked}
                      onChange={() =>
                        set(
                          "amenities",
                          checked
                            ? data.amenities.filter((x) => x !== a)
                            : [...data.amenities, a],
                        )
                      }
                    />
                    {AMENITY_LABELS[a]}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="mb-1 text-sm text-ink-soft">
              Используйте горизонтальные фотографии хорошего качества. Первое
              изображение будет главным.
            </p>
            <p className="mb-3 text-xs text-ink-muted">
              До 30 фото, каждое до 10 МБ — мы автоматически сожмём их для
              быстрой загрузки.
            </p>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-outline w-full justify-center py-4"
            >
              {uploading > 0 ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Загружаем ({uploading})…
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5" /> Выбрать фотографии
                </>
              )}
            </button>

            {data.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {data.images.map((img, i) => (
                  <div
                    key={img.id ?? img.url}
                    className="group relative overflow-hidden rounded-xl border border-slate-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`Фото ${i + 1}`}
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                    />
                    {i === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-bold text-white">
                        Главное
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between gap-1 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          aria-label="Сдвинуть влево"
                          onClick={() => moveImage(i, -1)}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-ink"
                        >
                          <ArrowUp className="h-4 w-4 -rotate-90" />
                        </button>
                        <button
                          type="button"
                          aria-label="Сдвинуть вправо"
                          onClick={() => moveImage(i, 1)}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-ink"
                        >
                          <ArrowDown className="h-4 w-4 -rotate-90" />
                        </button>
                        {i !== 0 && (
                          <button
                            type="button"
                            aria-label="Сделать главным"
                            onClick={() => makeCover(i)}
                            className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-amber-500"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="Удалить фото"
                        onClick={() => removeImage(i)}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="wPrice">
                Базовая цена за ночь, сом
              </label>
              <input
                id="wPrice"
                className="input text-lg font-bold"
                inputMode="numeric"
                value={data.price}
                onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))}
                placeholder="5500"
              />
            </div>
            <div>
              <label className="label" htmlFor="wOldPrice">
                Старая цена <span className="text-ink-muted">(необязательно, для скидки)</span>
              </label>
              <input
                id="wOldPrice"
                className="input"
                inputMode="numeric"
                value={data.oldPrice}
                onChange={(e) => set("oldPrice", e.target.value.replace(/\D/g, ""))}
                placeholder="6500"
              />
            </div>
            <p className="text-xs text-ink-muted">
              Стоимость брони рассчитывается автоматически: цена × количество
              ночей. Сезонные цены и цены выходного дня появятся позже.
            </p>
          </div>
        )}

        {step === 6 && (
          <div>
            <p className="mb-3 text-sm text-ink-soft">
              Нажмите на дату, чтобы закрыть или открыть её для бронирования.
              Закрытые даты гости выбрать не смогут.
            </p>
            <div className="mx-auto max-w-sm">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Предыдущий месяц"
                  onClick={() =>
                    setCalCursor((c) =>
                      c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 },
                    )
                  }
                  className="grid h-11 w-11 place-items-center rounded-lg text-ink-soft hover:bg-slate-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="font-bold text-ink">
                  {new Date(calCursor.y, calCursor.m).toLocaleDateString("ru-RU", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <button
                  type="button"
                  aria-label="Следующий месяц"
                  onClick={() =>
                    setCalCursor((c) =>
                      c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 },
                    )
                  }
                  className="grid h-11 w-11 place-items-center rounded-lg text-ink-soft hover:bg-slate-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-7 text-center text-xs font-semibold text-ink-muted">
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
                  <div key={d} className="py-1.5">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthGrid.map((iso, i) =>
                  iso === null ? (
                    <div key={`e${i}`} />
                  ) : (
                    <button
                      key={iso}
                      type="button"
                      disabled={iso < todayIso}
                      onClick={() => toggleDate(iso)}
                      className={cn(
                        "grid aspect-square min-h-10 place-items-center rounded-lg text-sm font-medium transition",
                        iso < todayIso
                          ? "text-slate-300"
                          : data.blockedDates.includes(iso)
                            ? "bg-rose-100 text-rose-600 line-through"
                            : "text-ink hover:bg-slate-100",
                      )}
                    >
                      {parseInt(iso.slice(8), 10)}
                    </button>
                  ),
                )}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-rose-100" /> Закрыто
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded border border-slate-200" /> Свободно
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-ink">Проверьте объявление</h2>
            <dl className="space-y-2 text-sm">
              {[
                ["Название", data.title],
                ["Тип", TYPE_LABELS[data.type]],
                ["Расположение", `${data.location}, ${SHORE_LABELS[data.shore]}`],
                [
                  "Вместимость",
                  `до ${data.maxGuests} гостей · ${data.bedrooms} сп. · ${data.beds} кр. · ${data.bathrooms} с/у`,
                ],
                [
                  "Удобства",
                  data.amenities.map((a) => AMENITY_LABELS[a]).join(", ") || "—",
                ],
                ["Фотографии", `${data.images.length} шт.`],
                [
                  "Цена",
                  data.price ? `${formatSom(parseInt(data.price, 10))} сом / ночь` : "—",
                ],
                ["Закрытые даты", `${data.blockedDates.length}`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 border-b border-slate-100 pb-2"
                >
                  <dt className="shrink-0 text-ink-muted">{k}</dt>
                  <dd className="text-right font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="rounded-xl bg-brand-50 p-4 text-sm text-ink-soft">
              После отправки объявление проверит администратор IK-HOUSE. Обычно
              это занимает меньше суток. После одобрения объект появится в
              каталоге.
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {data.status === "published" ? (
                <button
                  onClick={() => finish("saved")}
                  disabled={saving}
                  className="btn-primary flex-1 justify-center"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Сохранить изменения
                </button>
              ) : (
                <>
                  <button
                    onClick={() => finish("moderation")}
                    disabled={saving}
                    className="btn-primary flex-1 justify-center"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Отправить на модерацию
                  </button>
                  <button
                    onClick={() => finish("draft")}
                    disabled={saving}
                    className="btn-outline flex-1 justify-center"
                  >
                    Сохранить как черновик
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky-навигация мастера */}
      {step < 7 && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="container-page flex items-center justify-between gap-3 py-3">
            <button
              onClick={back}
              disabled={step === 0 || saving}
              className="btn-outline min-w-24 justify-center disabled:opacity-40"
            >
              Назад
            </button>
            <span className="text-xs text-ink-muted">
              {data.id ? "Черновик сохраняется автоматически" : ""}
            </span>
            <button
              onClick={next}
              disabled={saving}
              className="btn-primary min-w-32 justify-center"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Продолжить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
