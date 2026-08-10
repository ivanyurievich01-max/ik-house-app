import type { Owner, Property, Review } from "@/types/property";

/**
 * Фотографии берутся из Unsplash CDN (легально, hotlink разрешён их лицензией).
 * Если у объекта появятся собственные фото — положите их в /public/images/properties
 * и укажите относительные пути, например "/images/properties/laguna-1.jpg".
 * У всех <Image> есть fallback (см. components/ui/SafeImage), поэтому битых картинок не будет.
 */
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`;

// Пул фотографий: экстерьеры, интерьеры, спальни, озеро/пляж, террасы/бассейны
const PHOTO = {
  exteriors: [
    "1564013799919-ab600027ffc6",
    "1512917774080-9991f1c4c750",
    "1518780664697-55e3ad937233",
    "1568605114967-8130f3a36994",
    "1600585154340-be6161a56a0c",
    "1613490493576-7fde63acd811",
    "1502005229762-cf1b2da7c5d6",
    "1449158743715-0a90ebb6d2d8",
    "1512918728675-ed5a9ecdebfd",
    "1600047509807-ba8f99d2cdde",
  ],
  interiors: [
    "1600566753086-00f18fb6b3ea",
    "1600607687939-ce8a6c25118c",
    "1611892440504-42a792e24d32",
    "1522708323590-d24dbb6b0267",
    "1600210492486-724fe5c67fb0",
    "1520250497591-112f2f40a3f4",
    "1560448204-e02f11c3d0e2",
    "1600585154526-990dced4db0d",
  ],
  bedrooms: [
    "1505693416388-ac5ce068fe85",
    "1502672260266-1c1ef2d93688",
    "1566073771259-6a8506099945",
    "1571896349842-33c89424de2d",
    "1600566752355-35792bedcfea",
  ],
  nature: [
    "1518732714860-b62714ce0c59",
    "1470770841072-f978cf4d019e",
    "1507525428034-b723cf961d3e",
    "1439066615861-d1af74d74000",
    "1470071459604-3b5ec3a7fe05",
  ],
  extras: [
    "1613977257363-707ba9348227",
    "1590490360182-c33d57733427",
    "1512918728675-ed5a9ecdebfd",
    "1600585154340-be6161a56a0c",
  ],
};

function gallery(i: number): string[] {
  const pick = (arr: string[], k: number) => arr[k % arr.length];
  return [
    U(pick(PHOTO.exteriors, i)),
    U(pick(PHOTO.interiors, i)),
    U(pick(PHOTO.bedrooms, i)),
    U(pick(PHOTO.nature, i + 1)),
    U(pick(PHOTO.extras, i)),
    U(pick(PHOTO.interiors, i + 3)),
  ];
}

const AVATARS: Record<string, string> = {
  azamat: U("1500648767791-00dcc994a43e"),
  aigul: U("1544005313-94ddf0286df2"),
  ruslan: U("1507003211169-0a1dd7228f2d"),
  gulnara: U("1494790108377-be9c29b29330"),
  bekzat: U("1506794778202-cad84cf45f1d"),
  nurlan: U("1531427186611-ecfd6d936c79"),
};

const OWNERS: Owner[] = [
  { name: "Азамат", role: "Владелец", phone: "+996 555 123 456", whatsapp: "996555123456", avatar: AVATARS.azamat, responseTime: "обычно отвечает в течение часа" },
  { name: "Айгуль", role: "Хозяйка", phone: "+996 700 245 118", whatsapp: "996700245118", avatar: AVATARS.aigul, responseTime: "обычно отвечает за 2 часа" },
  { name: "Руслан", role: "Управляющий", phone: "+996 555 908 771", whatsapp: "996555908771", avatar: AVATARS.ruslan, responseTime: "обычно отвечает быстро" },
  { name: "Гульнара", role: "Хозяйка", phone: "+996 770 334 902", whatsapp: "996770334902", avatar: AVATARS.gulnara, responseTime: "обычно отвечает в течение часа" },
  { name: "Бекзат", role: "Владелец", phone: "+996 559 112 340", whatsapp: "996559112340", avatar: AVATARS.bekzat, responseTime: "обычно отвечает за 3 часа" },
  { name: "Нурлан", role: "Администратор", phone: "+996 501 774 220", whatsapp: "996501774220", avatar: AVATARS.nurlan, responseTime: "обычно отвечает быстро" },
];

const REVIEW_POOL: Omit<Review, "id">[] = [
  { name: "Анна", city: "Алматы", rating: 5, date: "2025-07-18", text: "Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё." },
  { name: "Дмитрий", city: "Бишкек", rating: 5, date: "2025-08-02", text: "Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера." },
  { name: "Асель", city: "Астана", rating: 4, date: "2025-07-05", text: "Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую." },
  { name: "Максим", city: "Караганда", rating: 5, date: "2025-06-28", text: "Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось." },
  { name: "Жанна", city: "Ош", rating: 5, date: "2025-08-11", text: "Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!" },
  { name: "Игорь", city: "Бишкек", rating: 4, date: "2025-07-22", text: "Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару." },
  { name: "Салтанат", city: "Алматы", rating: 5, date: "2025-06-15", text: "Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото." },
  { name: "Тимур", city: "Тараз", rating: 5, date: "2025-08-06", text: "Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое." },
];

function reviewsFor(i: number, count: number): Review[] {
  const n = Math.min(count, REVIEW_POOL.length);
  const out: Review[] = [];
  for (let k = 0; k < Math.max(3, n > 4 ? 4 : n); k++) {
    const r = REVIEW_POOL[(i + k) % REVIEW_POOL.length];
    out.push({ ...r, id: `rev-${i}-${k}` });
  }
  return out;
}

type Seed = {
  slug: string;
  title: string;
  type: Property["type"];
  location: string;
  shore: Property["shore"];
  distanceToBeach: number;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  oldPrice?: number;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: Property["amenities"];
  featured?: boolean;
  popular?: boolean;
  lat: number;
  lng: number;
  desc: string;
};

const SEEDS: Seed[] = [
  { slug: "kottedzh-laguna", title: "Коттедж «Лагуна»", type: "cottage", location: "Чолпон-Ата", shore: "south", distanceToBeach: 200, rating: 4.9, reviewsCount: 37, pricePerNight: 5500, oldPrice: 6500, guests: 8, bedrooms: 3, beds: 4, bathrooms: 2, amenities: ["wifi", "parking", "kitchen", "shower", "beach", "terrace", "tv"], featured: true, popular: true, lat: 42.6498, lng: 77.0836, desc: "Современный коттедж в 200 метрах от берега озера Иссык-Куль. Полностью меблирован, оборудован кухней и Wi-Fi. Просторная терраса с видом на горы, мангальная зона и парковка во дворе. Пляж и рестораны — в шаговой доступности." },
  { slug: "kottedzh-u-ozera", title: "Коттедж у озера", type: "cottage", location: "Чолпон-Ата", shore: "south", distanceToBeach: 80, rating: 4.9, reviewsCount: 52, pricePerNight: 6000, guests: 6, bedrooms: 2, beds: 3, bathrooms: 1, amenities: ["wifi", "kitchen", "beach", "parking", "bbq"], featured: true, popular: true, lat: 42.6512, lng: 77.0721, desc: "Уютный дом всего в 80 метрах от воды. Идеально для семьи: тихий двор, зелёная лужайка, зона барбекю. До собственного участка пляжа — минута пешком." },
  { slug: "mountain-view", title: "Коттедж «Mountain View»", type: "cottage", location: "Кара-Ой", shore: "south", distanceToBeach: 150, rating: 4.7, reviewsCount: 29, pricePerNight: 5500, guests: 7, bedrooms: 3, beds: 4, bathrooms: 2, amenities: ["wifi", "parking", "kitchen", "ac", "terrace"], popular: true, lat: 42.6301, lng: 76.9902, desc: "Дом с панорамным видом на хребет Кунгей-Ала-Тоо. Большие окна, светлые комнаты, терраса для вечернего чая. Отличная база, чтобы исследовать северный и южный берег." },
  { slug: "gostevoy-dom-ak-bulak", title: "Гостевой дом «Ак-Булак»", type: "guesthouse", location: "Бостери", shore: "north", distanceToBeach: 200, rating: 4.8, reviewsCount: 64, pricePerNight: 4500, guests: 8, bedrooms: 3, beds: 5, bathrooms: 2, amenities: ["wifi", "parking", "kitchen", "breakfast", "bbq"], featured: true, popular: true, lat: 42.6603, lng: 77.1512, desc: "Семейный гостевой дом в Бостери с домашней кухней и завтраком. Хозяева живут рядом и всегда подскажут лучшие места. Уютные номера, общая кухня и большой двор." },
  { slug: "gostevoy-dom-delfin", title: "Гостевой дом «Дельфин»", type: "guesthouse", location: "Тамчы", shore: "south", distanceToBeach: 300, rating: 4.6, reviewsCount: 41, pricePerNight: 7000, guests: 10, bedrooms: 4, beds: 6, bathrooms: 3, amenities: ["wifi", "parking", "kitchen", "ac", "pool", "breakfast"], popular: true, lat: 42.5701, lng: 76.7112, desc: "Просторный гостевой дом для большой компании. Есть небольшой бассейн, зона отдыха и парковка на несколько машин. Подходит для корпоративов и семейных праздников." },
  { slug: "uyutnyy-kottedzh", title: "Уютный коттедж", type: "cottage", location: "Чолпон-Ата", shore: "south", distanceToBeach: 120, rating: 4.5, reviewsCount: 23, pricePerNight: 3000, guests: 5, bedrooms: 2, beds: 3, bathrooms: 1, amenities: ["wifi", "kitchen", "parking"], lat: 42.6489, lng: 77.0655, desc: "Компактный и аккуратный дом по доступной цене. Всё необходимое для комфортного отдыха: кухня, Wi-Fi, парковка. Хороший вариант для пары или небольшой семьи." },
  { slug: "villa-sunset", title: "Вилла «Sunset»", type: "villa", location: "Бостери", shore: "north", distanceToBeach: 180, rating: 4.9, reviewsCount: 88, pricePerNight: 12000, oldPrice: 14000, guests: 12, bedrooms: 5, beds: 7, bathrooms: 4, amenities: ["wifi", "parking", "kitchen", "ac", "pool", "bbq", "terrace", "tv"], featured: true, popular: true, lat: 42.6631, lng: 77.1588, desc: "Премиальная вилла с собственным бассейном и панорамной террасой. Дизайнерский интерьер, пять спален, зона барбекю и лаунж у воды. Лучший выбор для незабываемого отдыха." },
  { slug: "pansionat-aurora", title: "Пансионат «Aurora»", type: "resort", location: "Чолпон-Ата", shore: "south", distanceToBeach: 150, rating: 4.8, reviewsCount: 210, pricePerNight: 6000, guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, amenities: ["wifi", "pool", "beach", "breakfast", "parking"], featured: true, popular: true, lat: 42.6521, lng: 77.0801, desc: "Большой комплекс с ухоженной территорией, бассейном и трёхразовым питанием. Номера с балконами, детская площадка, собственный выход к пляжу. Всё включено для спокойного отдыха." },
  { slug: "pansionat-altyn-kum", title: "Пансионат «Алтын-Кум»", type: "resort", location: "Бостери", shore: "north", distanceToBeach: 200, rating: 4.6, reviewsCount: 156, pricePerNight: 5500, guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, amenities: ["wifi", "pool", "beach", "breakfast", "parking", "ac"], popular: true, lat: 42.6659, lng: 77.1601, desc: "Классический пансионат на северном берегу. Большая зелёная территория, два бассейна, питание и анимация для детей. До золотистого песчаного пляжа — 200 метров." },
  { slug: "pansionat-kapriz", title: "Пансионат «Каприз»", type: "resort", location: "Чолпон-Ата", shore: "south", distanceToBeach: 100, rating: 4.7, reviewsCount: 132, pricePerNight: 4500, guests: 3, bedrooms: 1, beds: 2, bathrooms: 1, amenities: ["wifi", "pool", "beach", "breakfast"], lat: 42.6505, lng: 77.0777, desc: "Уютный пансионат в самом центре Чолпон-Аты, в сотне метров от воды. Бассейн, кафе, вечерние мероприятия. Удобно добираться до аквапарка и рынка." },
  { slug: "pansionat-edelveys", title: "Пансионат «Эдельвейс»", type: "resort", location: "Чолпон-Ата", shore: "south", distanceToBeach: 250, rating: 4.5, reviewsCount: 98, pricePerNight: 4000, guests: 4, bedrooms: 2, beds: 3, bathrooms: 1, amenities: ["wifi", "pool", "breakfast", "parking"], lat: 42.6478, lng: 77.0699, desc: "Тихий пансионат с большим садом и розарием. Спокойная атмосфера, бассейн и завтраки. Отличный выбор для тех, кто ценит уединённый отдых." },
  { slug: "pansionat-raduga", title: "Пансионат «Радуга»", type: "resort", location: "Бостери", shore: "north", distanceToBeach: 300, rating: 4.4, reviewsCount: 74, pricePerNight: 3500, guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, amenities: ["wifi", "pool", "parking"], lat: 42.6642, lng: 77.1555, desc: "Бюджетный семейный пансионат с бассейном и детской площадкой. Просто, чисто и недалеко от пляжа. Хороший вариант для отдыха без переплат." },
  { slug: "pansionat-marco-polo", title: "Пансионат «Marco Polo»", type: "resort", location: "Тамчы", shore: "south", distanceToBeach: 120, rating: 4.3, reviewsCount: 61, pricePerNight: 5000, guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, amenities: ["wifi", "pool", "beach", "parking", "ac"], lat: 42.5688, lng: 76.7201, desc: "Пансионат рядом с аэропортом Тамчы — удобно для тех, кто прилетает. Бассейн, ресторан, выход к пляжу. Комфортные номера с кондиционером." },
  { slug: "lake-house", title: "Lake House", type: "cottage", location: "Кара-Ой", shore: "south", distanceToBeach: 60, rating: 4.9, reviewsCount: 45, pricePerNight: 9000, oldPrice: 10500, guests: 8, bedrooms: 3, beds: 4, bathrooms: 2, amenities: ["wifi", "kitchen", "beach", "terrace", "bbq", "parking"], featured: true, popular: true, lat: 42.6288, lng: 76.9855, desc: "Дом у самой воды с деревянной террасой над пляжем. Панорамные окна, современный интерьер, всё для отдыха у озера. Просыпаться под шум волн — бесценно." },
  { slug: "nomad-residence", title: "Nomad Residence", type: "villa", location: "Чолпон-Ата", shore: "south", distanceToBeach: 220, rating: 4.8, reviewsCount: 53, pricePerNight: 15000, guests: 12, bedrooms: 5, beds: 8, bathrooms: 4, amenities: ["wifi", "parking", "kitchen", "ac", "pool", "bbq", "terrace", "tv"], popular: true, lat: 42.6533, lng: 77.0888, desc: "Дизайнерская резиденция в национальном стиле с современным комфортом. Бассейн, панорамная гостиная, пять спален. Идеально для больших семей и мероприятий." },
  { slug: "issyk-residence", title: "Issyk Residence", type: "apartment", location: "Чолпон-Ата", shore: "south", distanceToBeach: 400, rating: 4.6, reviewsCount: 37, pricePerNight: 4000, guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, amenities: ["wifi", "kitchen", "ac", "parking", "tv"], lat: 42.6467, lng: 77.0812, desc: "Современные апартаменты в центре Чолпон-Аты. Новый дом, лифт, охраняемая парковка. В пешей доступности кафе, рынок и набережная." },
  { slug: "sunrise-cottage", title: "Sunrise Cottage", type: "cottage", location: "Корумду", shore: "north", distanceToBeach: 90, rating: 4.7, reviewsCount: 34, pricePerNight: 5000, guests: 6, bedrooms: 2, beds: 3, bathrooms: 1, amenities: ["wifi", "kitchen", "beach", "parking", "bbq"], popular: true, lat: 42.6711, lng: 77.2098, desc: "Коттедж на тихом северном берегу с видом на восход над озером. Мангал, зелёный двор, до пляжа меньше ста метров. Спокойствие и природа." },
  { slug: "alpine-lake-house", title: "Alpine Lake House", type: "cottage", location: "Кара-Ой", shore: "south", distanceToBeach: 130, rating: 4.8, reviewsCount: 41, pricePerNight: 7500, guests: 8, bedrooms: 3, beds: 5, bathrooms: 2, amenities: ["wifi", "kitchen", "ac", "terrace", "parking", "tv"], lat: 42.6275, lng: 76.9799, desc: "Дом в альпийском стиле с камином и большой террасой. Тёплый уют деревянных интерьеров и вид на горы. Подходит и для летнего, и для межсезонного отдыха." },
  { slug: "guest-house-jetigen", title: "Гостевой дом «Жетиген»", type: "guesthouse", location: "Боконбаево", shore: "south", distanceToBeach: 500, rating: 4.5, reviewsCount: 27, pricePerNight: 3500, guests: 8, bedrooms: 4, beds: 6, bathrooms: 2, amenities: ["wifi", "kitchen", "breakfast", "parking"], lat: 42.1289, lng: 76.9877, desc: "Аутентичный гостевой дом на южном берегу рядом с юрточным лагерем. Домашняя кухня, национальный колорит и радушные хозяева. Отправная точка к Сказке и Барскоону." },
  { slug: "apartamenty-briz", title: "Апартаменты «Бриз»", type: "apartment", location: "Бостери", shore: "north", distanceToBeach: 250, rating: 4.4, reviewsCount: 19, pricePerNight: 3000, guests: 3, bedrooms: 1, beds: 2, bathrooms: 1, amenities: ["wifi", "kitchen", "ac", "tv"], lat: 42.6598, lng: 77.1499, desc: "Небольшие апартаменты для пары или троих. Есть всё для самостоятельного отдыха: кухня, кондиционер, быстрый интернет. До пляжа — 5 минут пешком." },
  { slug: "villa-jaz", title: "Вилла «Жаз»", type: "villa", location: "Чок-Тал", shore: "north", distanceToBeach: 160, rating: 4.9, reviewsCount: 46, pricePerNight: 13000, guests: 10, bedrooms: 4, beds: 6, bathrooms: 3, amenities: ["wifi", "parking", "kitchen", "ac", "pool", "bbq", "terrace"], featured: true, lat: 42.6822, lng: 76.9433, desc: "Светлая вилла с бассейном на северном берегу. Минималистичный дизайн, много воздуха и света, зона отдыха у воды. Для тех, кто ценит стиль и приватность." },
  { slug: "chalet-kungey", title: "Шале «Кунгей»", type: "cottage", location: "Чок-Тал", shore: "north", distanceToBeach: 140, rating: 4.7, reviewsCount: 31, pricePerNight: 8000, guests: 8, bedrooms: 3, beds: 5, bathrooms: 2, amenities: ["wifi", "kitchen", "terrace", "bbq", "parking", "tv"], popular: true, lat: 42.6801, lng: 76.9401, desc: "Уютное шале с видом на хребет Кунгей. Дерево, панорамные окна, камин и большая терраса. Атмосфера горного отдыха в двух шагах от озера." },
  { slug: "beach-house-tamchy", title: "Beach House Тамчы", type: "cottage", location: "Тамчы", shore: "south", distanceToBeach: 50, rating: 4.8, reviewsCount: 38, pricePerNight: 6500, guests: 6, bedrooms: 2, beds: 4, bathrooms: 2, amenities: ["wifi", "kitchen", "beach", "terrace", "bbq"], popular: true, lat: 42.5677, lng: 76.7155, desc: "Дом прямо у пляжа в Тамчы — всего 50 метров до воды. Терраса с видом на озеро, мангал, современная кухня. Лучшее место, чтобы встречать закаты." },
  { slug: "apartamenty-plaza", title: "Апартаменты «Plaza»", type: "apartment", location: "Чолпон-Ата", shore: "south", distanceToBeach: 350, rating: 4.5, reviewsCount: 22, pricePerNight: 4500, guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, amenities: ["wifi", "kitchen", "ac", "parking", "tv", "pool"], lat: 42.6455, lng: 77.0844, desc: "Апартаменты в новом жилом комплексе с бассейном во дворе. Свежий ремонт, всё необходимое, охраняемая территория. Удобно и для отдыха, и для работы у озера." },
];

export const properties: Property[] = SEEDS.map((s, i) => {
  const owner = OWNERS[i % OWNERS.length];
  return {
    id: `ik-${String(i + 1).padStart(3, "0")}`,
    slug: s.slug,
    title: s.title,
    type: s.type,
    location: s.location,
    shore: s.shore,
    address: `${s.location}, Иссык-Куль`,
    distanceToBeach: s.distanceToBeach,
    rating: s.rating,
    reviewsCount: s.reviewsCount,
    pricePerNight: s.pricePerNight,
    oldPrice: s.oldPrice,
    guests: s.guests,
    bedrooms: s.bedrooms,
    beds: s.beds,
    bathrooms: s.bathrooms,
    description: s.desc,
    amenities: s.amenities,
    images: gallery(i),
    featured: Boolean(s.featured),
    popular: Boolean(s.popular),
    available: true,
    blockedDates: buildBlockedDates(i),
    owner,
    coordinates: { lat: s.lat, lng: s.lng },
    reviews: reviewsFor(i, s.reviewsCount),
  };
});

/** Для MVP блокируем несколько будущих дат, чтобы показать календарь занятости */
function buildBlockedDates(i: number): string[] {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const out: string[] = [];
  const offsets = [7 + (i % 5), 8 + (i % 5), 9 + (i % 5), 20 + (i % 4), 21 + (i % 4)];
  for (const off of offsets) {
    const d = new Date(base);
    d.setDate(d.getDate() + off);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    out.push(`${y}-${m}-${day}`);
  }
  return out;
}

export function getProperty(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getSimilar(slug: string, limit = 4): Property[] {
  const current = getProperty(slug);
  if (!current) return properties.slice(0, limit);
  return properties
    .filter((p) => p.slug !== slug && p.shore === current.shore)
    .sort((a, b) => Math.abs(a.pricePerNight - current.pricePerNight) - Math.abs(b.pricePerNight - current.pricePerNight))
    .slice(0, limit);
}

export function getFeatured(limit = 8): Property[] {
  return [...properties]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
    .slice(0, limit);
}
