"use client";

import { createProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Принимаем список категорий, чтобы выбрать, куда положить товар
export default function CreateProductForm({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="font-bold mb-4">Быстрое добавление</h3>
      <form action={createProduct} className="grid gap-4">
        <Input name="name" placeholder="Название (например: Борщ)" required />
        <div className="grid grid-cols-2 gap-4">
            <Input name="price" type="number" placeholder="Цена (₽)" required />
            <Input name="weight" placeholder="Вес (300 г)" />
        </div>
        
        {/* Выбор категории */}
        <select name="categoryId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
            <option value="">Выберите категорию...</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
        </select>

        <Button type="submit">Создать товар</Button>
      </form>
    </div>
  );
}