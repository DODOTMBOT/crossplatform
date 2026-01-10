"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

const categories = ["Новинки", "Завтраки", "Супы", "Пицца", "Напитки"];

export default function CategoryNav() {
  const [active, setActive] = useState("Новинки");
  return (
    <div className="sticky top-[68px] z-40 bg-white/95 backdrop-blur py-4 border-b border-gray-100">
      <div className="overflow-x-auto no-scrollbar px-4 flex gap-2">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActive(cat)} className={cn("whitespace-nowrap px-5 py-2.5 rounded-full font-medium text-sm transition-all", active === cat ? "bg-[#C38C7F] text-white" : "bg-gray-100 text-gray-600")}>
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}