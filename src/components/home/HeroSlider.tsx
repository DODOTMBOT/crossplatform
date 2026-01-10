"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function HeroSlider() {
  return (
    <div className="w-full pl-4 mt-24 mb-8">
      <Swiper spaceBetween={12} slidesPerView={1.1} breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }}>
        <SwiperSlide>
          <div className="h-64 sm:h-80 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[28px] p-6 flex items-end text-white">
            <h3 className="text-2xl font-bold">Зимнее меню</h3>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-64 sm:h-80 bg-gradient-to-br from-orange-400 to-red-500 rounded-[28px] p-6 flex items-end text-white">
            <h3 className="text-2xl font-bold">Скидка 20%</h3>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}