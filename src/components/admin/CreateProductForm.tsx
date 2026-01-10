"use client";

import { createProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Интерфейс для категорий (чтобы TypeScript не ругался)
interface Category {
  id: string;
  name: string;
}

export default function CreateProductForm({ categories }: { categories: Category[] }) {
  // Храним ВСЕ данные в состоянии, чтобы они не пропадали при переключении табов
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    weight: "",
    description: "",
    image: "",
    badge: "",
    sku: "",
    iikoId: "",
    calories: "",
    proteins: "",
    fats: "",
    carbohydrates: "",
    sortIndex: "0",
    isAvailable: true,
    isArchived: false,
    isMarked: false,
  });

  // Функция для обновления полей
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Добавить/Изменить</h2>
        {/* Индикатор статуса */}
        <div className={`px-2 py-1 rounded text-xs font-bold ${formData.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {formData.isAvailable ? "В МЕНЮ" : "СКРЫТО"}
        </div>
      </div>

      <form action={createProduct}>
        {/* === ВАЖНО: Скрытые инпуты для отправки данных на сервер === 
            Они находятся вне табов, поэтому данные всегда отправятся */}
        {Object.entries(formData).map(([key, value]) => (
           <input key={key} type="hidden" name={key} value={String(value)} />
        ))}
        {/* Хак для чекбоксов, так как "false" строкой не всегда корректно парсится, но наш Action справится */}
        <input type="hidden" name="isMarkedValue" value={formData.isMarked ? "on" : ""} />


        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="main">Основное</TabsTrigger>
            <TabsTrigger value="props">Состав</TabsTrigger>
            <TabsTrigger value="media">Вид</TabsTrigger>
            <TabsTrigger value="tech">Настройки</TabsTrigger>
          </TabsList>

          {/* Вкладка 1: Основное */}
          <TabsContent value="main" className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Label>Название блюда</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => handleChange("name", e.target.value)} 
                placeholder="Например: Том Ям" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Цена (₽)</Label>
                <Input 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => handleChange("price", e.target.value)} 
                  placeholder="0" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Категория</Label>
                <select 
                  value={formData.categoryId}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Выбрать...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
               <Label>Вес / Объем</Label>
               <Input 
                 value={formData.weight} 
                 onChange={(e) => handleChange("weight", e.target.value)} 
                 placeholder="300 г / 0.5 л" 
               />
            </div>
          </TabsContent>

          {/* Вкладка 2: Свойства и КБЖУ */}
          <TabsContent value="props" className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <Label className="text-xs text-gray-500">Калории</Label>
                   <Input type="number" placeholder="Ккал" value={formData.calories} onChange={(e) => handleChange("calories", e.target.value)} />
                </div>
                <div className="space-y-1">
                   <Label className="text-xs text-gray-500">Белки</Label>
                   <Input type="number" placeholder="г" value={formData.proteins} onChange={(e) => handleChange("proteins", e.target.value)} />
                </div>
                <div className="space-y-1">
                   <Label className="text-xs text-gray-500">Жиры</Label>
                   <Input type="number" placeholder="г" value={formData.fats} onChange={(e) => handleChange("fats", e.target.value)} />
                </div>
                <div className="space-y-1">
                   <Label className="text-xs text-gray-500">Углеводы</Label>
                   <Input type="number" placeholder="г" value={formData.carbohydrates} onChange={(e) => handleChange("carbohydrates", e.target.value)} />
                </div>
             </div>
          </TabsContent>

          {/* Вкладка 3: Описание и Медиа */}
          <TabsContent value="media" className="space-y-4">
            <div className="space-y-2">
               <Label>Ссылка на фото</Label>
               <Input 
                 value={formData.image} 
                 onChange={(e) => handleChange("image", e.target.value)} 
                 placeholder="https://..." 
               />
            </div>
            
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => handleChange("description", e.target.value)} 
                placeholder="Состав, вкус, особенности..." 
                className="h-24"
              />
            </div>

            <div className="space-y-2">
               <Label>Бейдж (Маркетинг)</Label>
               <Input 
                 value={formData.badge} 
                 onChange={(e) => handleChange("badge", e.target.value)} 
                 placeholder="HIT, NEW, SPICY" 
               />
            </div>
          </TabsContent>

          {/* Вкладка 4: Технические настройки */}
          <TabsContent value="tech" className="space-y-4">
             <div className="flex flex-col gap-4 bg-gray-50 p-3 rounded-md">
                <div className="flex items-center justify-between">
                   <Label>Товар доступен (Активен)</Label>
                   <Switch checked={formData.isAvailable} onCheckedChange={(v) => handleChange("isAvailable", v)} />
                </div>
                <div className="flex items-center justify-between">
                   <Label>В архиве</Label>
                   <Switch checked={formData.isArchived} onCheckedChange={(v) => handleChange("isArchived", v)} />
                </div>
                <div className="flex items-center justify-between">
                   <Label>Честный знак (Маркировка)</Label>
                   <Switch checked={formData.isMarked} onCheckedChange={(v) => handleChange("isMarked", v)} />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Сортировка</Label>
                    <Input type="number" value={formData.sortIndex} onChange={(e) => handleChange("sortIndex", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Артикул</Label>
                    <Input value={formData.sku} onChange={(e) => handleChange("sku", e.target.value)} />
                </div>
             </div>
          </TabsContent>
        </Tabs>

        <Button type="submit" className="w-full mt-6 bg-[#C38C7F] hover:bg-[#A67366]">
          Сохранить товар
        </Button>
      </form>
    </div>
  );
}