"use client";

import { Product, ModifierGroup, Modifier } from "@prisma/client";
import { Button } from "@/components/ui/button";

type ProductWithModifiers = Product & {
  modifierGroups: (ModifierGroup & {
    modifiers: Modifier[];
  })[];
};

export default function ProductDetails({ product }: { product: ProductWithModifiers }) {
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 h-full bg-white overflow-y-auto no-scrollbar">
      
      {/* ЛЕВАЯ ЧАСТЬ: Медиа */}
      <div className="relative w-full aspect-square md:h-full bg-gray-50 flex items-center justify-center overflow-hidden">
        
        {/* ЛОГИКА: Видео > Фото > Заглушка */}
        {product.video ? (
            <video 
              src={product.video} 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover"
            />
        ) : product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <span className="text-gray-300">Нет фото</span>
        )}
        
        {product.badge && (
           <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm text-orange-500 uppercase z-10">
             {product.badge}
           </div>
        )}
      </div>

      {/* ПРАВАЯ ЧАСТЬ: Инфо */}
      <div className="p-6 md:p-10 flex flex-col h-full overflow-y-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-2 leading-tight">
          {product.name}
        </h1>
        
        <div className="text-gray-400 text-sm mb-4">
            {product.weight || product.volume}
            {product.calories && ` • ${product.calories} ккал`}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {product.description}
        </p>

        {/* Модификаторы */}
        {product.modifierGroups.length > 0 && (
          <div className="space-y-6 mb-8">
            {product.modifierGroups.map((group) => (
              <div key={group.id}>
                <h3 className="font-semibold mb-3 text-sm">{group.name}</h3>
                <div className="space-y-2">
                  {group.modifiers.map((mod) => (
                    <label key={mod.id} className="flex items-center justify-between cursor-pointer group hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors">
                      <div className="flex items-center">
                         <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 mr-3" />
                         <span className="text-sm font-medium text-gray-700">{mod.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {mod.price > 0 ? `+ ${mod.price} ₽` : ""}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Футер */}
        <div className="mt-auto pt-6 border-t border-gray-100 bg-white sticky bottom-0">
          <Button className="w-full h-12 text-base font-bold rounded-xl bg-[#FF6900] hover:bg-[#E65E00] text-white shadow-lg shadow-orange-200 transition-all active:scale-[0.98]">
            Добавить за {product.price} ₽
          </Button>
        </div>
      </div>
    </div>
  );
}