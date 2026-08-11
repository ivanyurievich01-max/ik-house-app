import SafeImage from "@/components/ui/SafeImage";
import SearchBar from "@/components/search/SearchBar";
import { ShieldCheck, BadgeCheck, Headphones, Sparkles } from "lucide-react";
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

/* Hero тянется под прозрачный header (-mt-16 + pt под высоту шапки),
 * композиция первого экрана сжата под референс: headline → описание →
 * trust-строка → search → social proof, чтобы карточки берегов
 * попадали в первый desktop-viewport. */
export default function Hero() {
  return (
    <section className="relative -mt-16 bg-ink">
      {/* Фото и overlay — в отдельном absolute-слое с overflow-hidden,
          чтобы попапы календаря/гостей из поиска НЕ обрезались hero-контейнером */}
      <div className="absolute inset-0 overflow-hidden">
        <SafeImage
          src="/images/home/hero-issyk-kul.webp"
          alt="Коттедж у озера Иссык-Куль на фоне гор"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center] lg:object-[70%_center]"
        />
        {/* Overlay: слева темнее (под текст), сверху — под header, справа виден коттедж */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1630]/80 via-[#0b1630]/40 to-[#0b1630]/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1630]/55 via-transparent to-[#0b1630]/70" />
      </div>

      <div className="relative w-full pb-4 pt-[92px] sm:pt-[100px]">
        <div className="container-page relative">
          <div className="max-w-2xl text-white animate-fade-in">
            <h1 className="text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl xl:text-6xl">
              Отдых, который
              <br />
              ты запомнишь
              <Sparkles className="ml-2 inline h-6 w-6 text-amber-300 sm:h-8 sm:w-8" />
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/85 sm:text-lg">
              Коттеджи, гостевые дома и пансионаты напрямую от владельцев.
              Проверенные варианты, честные цены и быстрое бронирование на
              Иссык-Куле.
            </p>

            {/* Trust items — компактная горизонтальная строка на desktop */}
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:mt-5 sm:grid-cols-3 sm:gap-5">
              {TRUST.map((t) => (
                <div key={t.title} className="flex items-start gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/12 backdrop-blur">
                    <t.icon className="h-4 w-4 text-white" />
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

          {/* Поисковый виджет + social proof — подняты внутрь Hero */}
          <div className="relative mt-5 sm:mt-6">
            <SearchBar variant="hero" />
            <HeroProof />
          </div>
        </div>
      </div>
    </section>
  );
}
