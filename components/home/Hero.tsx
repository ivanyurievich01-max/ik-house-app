import SafeImage from "@/components/ui/SafeImage";
import SearchBar from "@/components/search/SearchBar";
import { ShieldCheck, Star, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[520px] w-full overflow-hidden sm:h-[560px]">
        <SafeImage
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=75"
          alt="Озеро Иссык-Куль в окружении гор"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/60" />

        <div className="container-page relative flex h-full flex-col justify-center">
          <div className="max-w-2xl text-white animate-fade-in">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <MapPin className="h-3.5 w-3.5" />
              Северный и Южный берег Иссык-Куля
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Найдите идеальное жильё на Иссык-Куле
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/90 sm:text-lg">
              Коттеджи, гостевые дома и пансионаты напрямую от владельцев.
              Проверенные варианты, честные цены и бронирование за минуту.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/90">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Проверенные объекты
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-white" /> Реальные отзывы гостей
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Поиск — наезжает на hero снизу */}
      <div className="container-page relative -mt-14 pb-2 sm:-mt-16">
        <SearchBar variant="hero" />
      </div>
    </section>
  );
}
