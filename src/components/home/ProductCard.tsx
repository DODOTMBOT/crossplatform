"use client";

import Link from "next/link";
import Image from "next/image"; // Импортируем Image
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductSize } from "@prisma/client";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  weight: string;
  image?: string | null;
  video?: string | null;
  badge?: string | null;
  sizes?: ProductSize[];
}

export default function ProductCard({ id, title, price, weight, image, video, badge, sizes = [] }: ProductCardProps) {
  const minPrice = sizes.length > 0 ? Math.min(...sizes.map(s => s.price)) : price;
  const displayPrice = sizes.length > 0 ? `от ${minPrice} ₽` : `${price} ₽`;

  return (
    <Link href={`/product/${id}`} scroll={false} className="block group h-full">
      <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer">
        
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {video ? (
            <video src={video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          ) : image ? (
            // ИСПОЛЬЗУЕМ IMAGE
            <Image 
              src={image} 
              alt={title} 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">Нет фото</div>
          )}
          
          {badge && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm z-10">
              {badge}
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
             <div className="text-xl font-bold">{displayPrice}</div>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-1 leading-tight group-hover:text-[#C38C7F] transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className="text-sm text-gray-400 mb-4">{weight}</p>
          
          <div className="mt-auto pt-2">
            <Button className="w-full rounded-xl bg-gray-100 text-black hover:bg-[#1C1C1C] hover:text-white transition-colors">
              <Plus className="w-4 h-4 mr-2" /> Добавить
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}