"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@prisma/client";

export default function HeroSlider({ banners }: { banners: Banner[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!banners || banners.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      
      // Ширина карточки (300px) + отступ (24px) = ~325px
      const scrollAmount = direction === "left" ? -325 : 325;
      
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const showControls = banners.length > 3;

  return (
    // -mx-4 позволяет контейнеру чуть выйти за границы основного контента на мобильных, 
    // чтобы скролл был от края до края, но при этом px-8 внутри компенсирует это.
    <div className="relative group container mx-auto mt-24 mb-6">
      
      {/* Кнопка "Влево" */}
      {showControls && (
        <button 
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-100 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hidden md:block"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
      )}

      {/* Контейнер слайдов */}
      <div 
        ref={scrollRef}
        // ИЗМЕНЕНИЯ:
        // 1. py-12: Достаточный отступ сверху/снизу для мягкой тени
        // 2. px-8: Отступ слева/справа ВНУТРИ скролла, чтобы крайние тени не обрезались контейнером
        className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-12 px-20"
        style={{ scrollbarWidth: "none" }} 
      >
        {banners.map((banner) => (
          <div 
            key={banner.id} 
            // ИЗМЕНЕНИЯ В СТИЛЯХ КАРТОЧКИ:
            // 1. shadow-[0_8px_30px_rgb(0,0,0,0.04)] — очень мягкая, рассеянная тень
            // 2. hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] — чуть темнее при наведении
            // 3. border-transparent — убрал серую рамку, чтобы не мешала мягкости (или сделал её очень тонкой если нужно)
            className="flex-shrink-0 snap-start relative rounded-[2rem] overflow-hidden 
                       shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
                       hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                       transition-all duration-500 cursor-pointer border border-gray-100/50
                       w-[220px] h-[320px] 
                       md:w-[300px] md:h-[420px]"
          >
            {banner.link ? (
              <Link href={banner.link} className="block w-full h-full">
                <img 
                  src={banner.image} 
                  alt="Promo" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
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
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-100 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hidden md:block"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      )}
    </div>
  );
}