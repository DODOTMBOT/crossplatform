import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductProps {
  title: string;
  price: number;
  weight: string;
  image?: string | null; // Разрешаем null
  badge?: string | null;
  description?: string | null;
}

export default function ProductCard({ title, price, weight, image, badge }: ProductProps) {
  return (
    <div className="group flex flex-col h-full">
      {/* Картинка */}
      <div className="relative aspect-square bg-gray-50 rounded-[28px] overflow-hidden mb-3">
        {image ? (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100">
                NO PHOTO
            </div>
        )}
        
        {/* Бейджик (например HIT) */}
        {badge && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#C38C7F] shadow-sm">
                {badge}
            </div>
        )}
      </div>

      {/* Информация */}
      <div className="flex flex-col flex-grow gap-1">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg leading-6 text-[#1C1C1C]">{title}</h3>
        </div>
        <p className="text-sm text-gray-400 mb-3">{weight}</p>
      </div>

      {/* Кнопка (Прижата к низу) */}
      <div className="mt-auto">
        <Button 
            variant="secondary" 
            className="w-full justify-between rounded-[20px] h-12 bg-gray-100 hover:bg-[#C38C7F] hover:text-white transition-all group-hover:shadow-md"
        >
            <span className="font-bold text-md">{price} ₽</span>
            <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}