"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Category } from "@prisma/client";

interface CategoryNavProps {
  categories: Category[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (categories.length > 0) {
      setActive(categories[0].id);
    }
  }, [categories]);

  const scrollToCategory = (catId: string) => {
    setActive(catId);
    const element = document.getElementById(catId);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  if (categories.length === 0) return null;

  return (
    <div className="sticky top-[68px] z-40 bg-white/95 backdrop-blur py-4 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4"> {/* Контейнер для выравнивания */}
        <div className="flex overflow-x-auto no-scrollbar pb-1 -mx-1 px-1"> {/* Скролл */}
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={cn(
                  "whitespace-nowrap px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95",
                  active === cat.id
                    ? "bg-[#C38C7F] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}