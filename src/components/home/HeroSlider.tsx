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
      const scrollAmount = direction === "left" ? -320 : 320;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const showControls = banners.length > 4;

  return (
    // Контейнер, задающий ширину страницы (как у остального контента)
    <div className="container mx-auto px-4 mt-28 mb-8 relative group">
      
      {/* Кнопки навигации */}
      {showControls && (
        <button 
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md shadow-md border border-gray-100 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hidden xl:block"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
      )}

      {/* Хитрость для теней: 
         1. -ml-4 и -mr-4 (или w-[calc(100%+2rem)]) расширяют блок
         2. pl-4 создает отступ внутри, чтобы первый слайд встал ровно по линии контейнера
         3. py-10 дает место для теней сверху и снизу
      */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-10 -mx-4 px-4"
        style={{ scrollbarWidth: "none" }} 
      >
        {banners.map((banner) => (
          <div 
            key={banner.id} 
            className="flex-shrink-0 snap-start relative rounded-[2rem] overflow-hidden 
                       shadow-[0_8px_30px_rgb(0,0,0,0.06)] 
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

      {showControls && (
        <button 
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md shadow-md border border-gray-100 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hidden xl:block"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      )}
    </div>
  );
}