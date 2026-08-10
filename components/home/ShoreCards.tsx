import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

const SHORES = [
  {
    href: "/catalog?shore=north",
    title: "Северный берег",
    desc: "Чолпон-Ата, Бостери, Корумду, Кара-Ой — центр курортной жизни, пляжи и развлечения.",
    img: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=70",
  },
  {
    href: "/catalog?shore=south",
    title: "Южный берег",
    desc: "Тихий отдых, природа и уютные гостевые дома. Ближе к Сказке, Барскоону и юртам.",
    img: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=1200&q=70",
  },
];

export default function ShoreCards() {
  return (
    <section className="container-page py-14">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
          Выберите берег
        </h2>
        <p className="mt-1 text-ink-muted">
          Два берега — два разных отдыха на одном озере.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {SHORES.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="group relative h-64 overflow-hidden rounded-2xl shadow-card"
          >
            <SafeImage
              src={s.img}
              alt={s.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h3 className="text-2xl font-extrabold">{s.title}</h3>
              <p className="mt-1 max-w-sm text-sm text-white/85">{s.desc}</p>
              <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-xl bg-white/95 px-3.5 py-2 text-sm font-semibold text-ink transition group-hover:gap-2.5">
                Смотреть жильё <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
