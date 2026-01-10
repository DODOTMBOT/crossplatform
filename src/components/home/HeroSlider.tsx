"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  image: string;
  link: string | null;
}

export default function HeroSlider({ banners }: { banners: Banner[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Если баннеров нет, компонент ничего не рисует
  if (!banners || banners.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Скроллим на 300px (примерная ширина баннера)
      const scrollAmount = direction === "left" ? -320 : 320;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Показываем управление только если баннеров много
  const showControls = banners.length > 4;

  return (
    <div className="relative group container mx-auto px-4 mt-8 mb-10">
      
      {/* Кнопка "Влево" */}
      {showControls && (
        <button 
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border border-gray-100 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-2 hover:scale-110 hidden md:block"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Контейнер слайдов */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2"
        style={{ scrollbarWidth: "none" }} // Скрываем скроллбар для Firefox
      >
        {banners.map((banner) => (
          <div 
            key={banner.id} 
            className="flex-shrink-0 snap-center relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer w-[280px] h-[160px] md:w-[350px] md:h-[200px]"
          >
            {/* Если есть ссылка - оборачиваем в Link, иначе просто картинка */}
            {banner.link ? (
              <Link href={banner.link} className="block w-full h-full">
                <img 
                  src={banner.image} 
                  alt="Promo" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </Link>
            ) : (
              <img 
                src={banner.image} 
                alt="Promo" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* Кнопка "Вправо" */}
      {showControls && (
        <button 
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border border-gray-100 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -mr-2 hover:scale-110 hidden md:block"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}
    </div>
  );
}