import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

const SHORES = [
  {
    href: "/catalog?shore=south",
    title: "Южный берег",
    desc: "Тишина, природа и чистый воздух",
    chips: ["Спокойствие", "Природа", "Семейный отдых"],
    img: "/images/home/south-shore.webp",
    alt: "Южный берег Иссык-Куля на закате",
    pos: "object-[center_60%]",
    overlay: "from-[#3a2410]/80 via-[#3a2410]/30",
  },
  {
    href: "/catalog?shore=north",
    title: "Северный берег",
    desc: "Драйв, развлечения и уютные места",
    chips: ["Кафе", "Развлечения", "Активный отдых"],
    img: "/images/home/north-shore.webp",
    alt: "Северный берег Иссык-Куля вечером",
    pos: "object-[70%_center]",
    overlay: "from-[#0b1c3a]/80 via-[#0b1c3a]/30",
  },
];

export default function ShoreCards() {
  return (
    <section className="container-page pb-10 pt-5 sm:pb-12 sm:pt-6">
      {/* Заголовок секции убран по референсу: карточки идут сразу после Hero */}
      <h2 className="sr-only">Выберите берег</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {SHORES.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="group relative h-60 overflow-hidden rounded-2xl shadow-card sm:h-64"
          >
            <SafeImage
              src={s.img}
              alt={s.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover transition duration-500 group-hover:scale-105 ${s.pos}`}
            />
            {/* Тёмный градиент слева → прозрачный справа + мягкое затемнение снизу */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${s.overlay} to-transparent`}
            />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/45 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5 text-white sm:p-6">
              <h3 className="text-2xl font-extrabold">{s.title}</h3>
              <p className="mt-1 text-sm text-white/90">{s.desc}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {s.chips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-white/18 px-2.5 py-1 text-xs font-medium backdrop-blur-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <span className="mt-3.5 inline-flex w-fit items-center gap-1.5 rounded-xl bg-white/95 px-3.5 py-2 text-sm font-semibold text-ink transition group-hover:gap-2.5">
                Смотреть варианты <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
