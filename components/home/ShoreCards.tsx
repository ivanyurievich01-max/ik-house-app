import Link from "next/link";
import { ArrowRight, Palmtree, FerrisWheel } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

const SHORES = [
  {
    href: "/catalog?shore=south",
    title: "Южный берег",
    desc: "Тишина, природа и чистый воздух",
    chips: ["Спокойствие", "Природа", "Пляжи"],
    img: "/images/home/south-shore.webp",
    alt: "Южный берег Иссык-Куля на закате",
    pos: "object-[center_60%]",
    overlay: "from-[#3a2410]/80 via-[#3a2410]/30",
    icon: Palmtree,
    iconBg: "bg-amber-400/90 text-amber-950",
  },
  {
    href: "/catalog?shore=north",
    title: "Северный берег",
    desc: "Движ, развлечения и уютные места",
    chips: ["Кафе", "Развлечения", "Активный отдых"],
    img: "/images/home/north-shore.webp",
    alt: "Северный берег Иссык-Куля вечером",
    pos: "object-[70%_center]",
    overlay: "from-[#0b1c3a]/80 via-[#0b1c3a]/30",
    icon: FerrisWheel,
    iconBg: "bg-brand-500/90 text-white",
  },
];

export default function ShoreCards() {
  return (
    <section className="container-page pb-8 pt-5 sm:pb-12 sm:pt-6">
      {/* Заголовок секции убран по референсу: карточки идут сразу после Hero */}
      <h2 className="sr-only">Выберите берег</h2>
      <div className="grid grid-cols-2 gap-2.5 md:gap-5">
        {SHORES.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="group relative h-[290px] overflow-hidden rounded-2xl shadow-card md:h-64"
          >
            <SafeImage
              src={s.img}
              alt={s.alt}
              fill
              sizes="(max-width: 768px) 50vw, 50vw"
              className={`object-cover transition duration-500 group-hover:scale-105 ${s.pos}`}
            />
            {/* Тёмный градиент слева → прозрачный справа + мягкое затемнение снизу */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${s.overlay} to-transparent`}
            />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/45 to-transparent" />

            {/* Круглая иконка сверху — как в утверждённом mobile-макете */}
            <span
              className={`absolute left-3.5 top-3.5 grid h-10 w-10 place-items-center rounded-full shadow-soft md:hidden ${s.iconBg}`}
            >
              <s.icon className="h-5 w-5" />
            </span>

            <div className="absolute inset-0 flex flex-col justify-end p-3.5 text-white md:p-6">
              <h3 className="text-lg font-extrabold leading-tight md:text-2xl">
                {s.title}
              </h3>
              <p className="mt-1 text-[13px] leading-snug text-white/90 md:text-sm">
                {s.desc}
              </p>
              <div className="mt-2 flex flex-wrap gap-1 md:mt-2.5 md:gap-1.5">
                {s.chips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-white/18 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm md:px-2.5 md:py-1 md:text-xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <span className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-xl bg-white/95 px-3 py-1.5 text-[13px] font-semibold text-ink transition group-hover:gap-2.5 md:mt-3.5 md:px-3.5 md:py-2 md:text-sm">
                Смотреть варианты <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
