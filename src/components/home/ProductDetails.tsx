"use client";

import { Product, ModifierGroup, Modifier, ProductSize, ProductTopping, Topping } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type ProductWithDetails = Product & {
  modifierGroups: (ModifierGroup & { modifiers: Modifier[] })[];
  sizes: ProductSize[];
  // ВАЖНО: Типизация для топпингов
  productToppings: (ProductTopping & { topping: Topping })[];
};

export default function ProductDetails({ product }: { product: ProductWithDetails }) {
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(
    product.sizes.length > 0 ? product.sizes[0].id : null
  );
  
  // Состояние выбранных топпингов (массив ID ProductTopping)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  // Итоговая цена
  const [totalPrice, setTotalPrice] = useState(product.price);

  useEffect(() => {
    let price = product.price;

    // 1. Учитываем размер
    if (selectedSizeId) {
      const size = product.sizes.find(s => s.id === selectedSizeId);
      if (size) price = size.price;
    }

    // 2. Учитываем топпинги
    selectedToppings.forEach(ptId => {
        const topping = product.productToppings.find(pt => pt.id === ptId);
        if (topping) price += topping.price;
    });

    setTotalPrice(price);
  }, [selectedSizeId, selectedToppings, product]);

  const toggleTopping = (id: string) => {
    setSelectedToppings(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 h-full bg-white overflow-y-auto no-scrollbar">
      
      {/* Медиа */}
      <div className="relative w-full aspect-square md:h-full bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.video ? (
            <video src={product.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
        ) : product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-300">Нет фото</span>
        )}
        {product.badge && (
           <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm text-orange-500 uppercase z-10">{product.badge}</div>
        )}
      </div>

      {/* Инфо */}
      <div className="p-6 md:p-10 flex flex-col h-full overflow-y-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-2 leading-tight">{product.name}</h1>
        
        <div className="text-gray-400 text-sm mb-4">
            {!selectedSizeId && (product.weight || product.volume)}
            {product.calories && ` • ${product.calories} ккал`}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

        {/* Размеры */}
        {product.sizes.length > 0 && (
          <div className="mb-6 bg-gray-100 p-1 rounded-xl flex gap-1">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSizeId(size.id)}
                className={cn(
                  "flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 text-center",
                  selectedSizeId === size.id ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-800"
                )}
              >
                {size.name}
              </button>
            ))}
          </div>
        )}

        {/* ТОППИНГИ (Добавить в товар) */}
{product.productToppings?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4">Добавить по вкусу</h3>
                <div className="grid grid-cols-3 gap-3">
                    {product.productToppings.map((pt) => {
                        const isSelected = selectedToppings.includes(pt.id);
                        return (
                            <div 
                                key={pt.id}
                                onClick={() => toggleTopping(pt.id)}
                                className={cn(
                                    "relative cursor-pointer rounded-xl border p-2 flex flex-col items-center gap-2 transition-all duration-200",
                                    isSelected ? "border-[#FF6900] ring-1 ring-[#FF6900] bg-orange-50/30" : "border-gray-100 hover:border-gray-200 bg-white"
                                )}
                            >
                                <div className="w-16 h-16 relative">
                                    <img src={pt.topping.image} alt={pt.topping.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="text-center">
                                    <div className="text-[11px] font-medium leading-tight mb-1">{pt.topping.name}</div>
                                    <div className="text-[12px] font-bold">{pt.price} ₽</div>
                                </div>
                                {isSelected && (
                                    <div className="absolute top-2 right-2 bg-[#FF6900] text-white rounded-full p-0.5">
                                        <Check className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        )}

        {/* Старые модификаторы (если используются) */}
        {/* ... код modifiers ... */}

        <div className="mt-auto pt-6 border-t border-gray-100 bg-white sticky bottom-0">
          <Button className="w-full h-12 text-base font-bold rounded-xl bg-[#FF6900] hover:bg-[#E65E00] text-white shadow-lg shadow-orange-200 transition-all active:scale-[0.98]">
            Добавить за {totalPrice} ₽
          </Button>
        </div>
      </div>
    </div>
  );
}