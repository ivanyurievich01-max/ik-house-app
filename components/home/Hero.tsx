import SafeImage from "@/components/ui/SafeImage";
import SearchBar from "@/components/search/SearchBar";
import { ShieldCheck, BadgeCheck, Headphones, MapPin, Sparkles } from "lucide-react";
import HeroProof from "@/components/home/HeroProof";

const TRUST = [
  {
    icon: ShieldCheck,
    title: "Проверенные объекты",
    text: "Каждый объект проходит проверку",
  },
  {
    icon: BadgeCheck,
    title: "Гарантия заселения",
    text: "Поможем, если возникнет проблема",
  },
  {
    icon: Headphones,
    title: "Поддержка 24/7",
    text: "До и во время отдыха",
  },
];

export default function Hero() {
  return (
    <section className="relative bg-ink">
      <div className="relative w-full overflow-hidden pb-6 pt-10 sm:pt-14">
        <SafeImage
          src="/images/home/hero-issyk-kul.webp"
          alt="Коттедж у озера Иссык-Куль на фоне гор"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center] lg:object-[70%_center]"
        />
        {/* Overlay: слева темнее (под текст), справа светлее (виден коттедж) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1630]/80 via-[#0b1630]/40 to-[#0b1630]/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1630]/40 via-transparent to-[#0b1630]/70" />

        <div className="container-page relative">
          <div className="max-w-2xl text-white animate-fade-in">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <MapPin className="h-3.5 w-3.5" />
              Северный и Южный берег Иссык-Куля
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl">
              Отдых, который
              <br />
              ты запомнишь
              <Sparkles className="ml-2 inline h-6 w-6 text-amber-300 sm:h-8 sm:w-8" />
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
              Коттеджи, гостевые дома и пансионаты напрямую от владельцев.
              Проверенные варианты, честные цены и быстрое бронирование на
              Иссык-Куле.
            </p>

            {/* Trust items */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
              {TRUST.map((t) => (
                <div key={t.title} className="flex items-start gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/12 backdrop-blur">
                    <t.icon className="h-4.5 w-4.5 h-[18px] w-[18px] text-white" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold leading-tight">
                      {t.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-white/70">
                      {t.text}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Поисковый виджет — единая карточка */}
          <div className="relative mt-8">
            <SearchBar variant="hero" />
            <HeroProof />
          </div>
        </div>
      </div>
    </section>
  );
}
