import type { Amenity, PropertyType, Shore } from "@/types/property";

export const LOCATIONS = [
  "Чолпон-Ата",
  "Бостери",
  "Кара-Ой",
  "Тамчы",
  "Корумду",
  "Боконбаево",
  "Чок-Тал",
  "Булан-Соготту",
] as const;

export const SHORE_LABELS: Record<Shore, string> = {
  north: "Северный берег",
  south: "Южный берег",
};

export const TYPE_LABELS: Record<PropertyType, string> = {
  cottage: "Коттедж",
  guesthouse: "Гостевой дом",
  resort: "Пансионат",
  villa: "Вилла",
  apartment: "Апартаменты",
  house: "Дом",
  room: "Комната",
};

export const AMENITY_LABELS: Record<Amenity, string> = {
  wifi: "Wi-Fi",
  parking: "Парковка",
  kitchen: "Кухня",
  ac: "Кондиционер",
  bbq: "Мангал",
  pool: "Бассейн",
  beach: "Пляж рядом",
  breakfast: "Завтрак",
  tv: "Телевизор",
  washer: "Стиральная машина",
  terrace: "Терраса",
  shower: "Душ",
  bath: "Ванна",
  balcony: "Балкон",
  playground: "Детская площадка",
  lake_view: "Вид на озеро",
  mountain_view: "Вид на горы",
};

export const FILTER_LOCATIONS: string[] = [
  "Южный берег",
  "Северный берег",
  "Тамчы",
  "Чолпон-Ата",
  "Бостери",
  "Кара-Ой",
  "Корумду",
];

export const FILTER_TYPES: PropertyType[] = [
  "cottage",
  "guesthouse",
  "resort",
  "apartment",
  "villa",
];

export const FILTER_AMENITIES: Amenity[] = [
  "wifi",
  "parking",
  "kitchen",
  "ac",
  "bbq",
  "pool",
  "beach",
  "breakfast",
];

export const GUEST_OPTIONS = [1, 2, 4, 6, 8, 10];

export const PRICE_MIN = 800;
export const PRICE_MAX = 25000;

export const CONTACTS = {
  phone: "+996 555 123 456",
  phoneHref: "+996555123456",
  whatsapp: "996555123456",
  telegram: "ikhouse_support",
  email: "hello@ik-house.kg",
};

/** Контакты разработчика сайта (developer credit в футере).
 *  Не путать с контактами IK-HOUSE и владельцев жилья. */
export const DEVELOPER_CONTACTS = {
  name: "Иван Юрьевич",
  instagram: "ivan.yurievch",
  instagramUrl: "https://www.instagram.com/ivan.yurievch/",
  whatsappDisplay: "+90 534 431 28 25",
  whatsappNumber: "905344312825",
  whatsappMessage:
    "Здравствуйте, Иван Юрьевич! Увидел разработанный вами сайт IK-HOUSE. Хотел бы обсудить разработку сайта.",
};

export function ratingLabel(rating: number): string {
  if (rating >= 4.8) return "Превосходно";
  if (rating >= 4.5) return "Отлично";
  if (rating >= 4.2) return "Очень хорошо";
  return "Хорошо";
}
