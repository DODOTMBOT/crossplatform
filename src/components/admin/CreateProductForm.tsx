"use client";

import { createProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@prisma/client";
import { useState } from "react";

interface Props {
  categories: Category[];
  tenantId: string;
}

export default function CreateProductForm({ categories, tenantId }: Props) {
  const [measureType, setMeasureType] = useState("weight");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить товар</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createProduct} className="space-y-6">
          <input type="hidden" name="tenantId" value={tenantId} />

          {/* 1. Название и Категория */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Название товара</Label>
              <Input name="name" required placeholder="Борщ" />
            </div>
            <div className="space-y-2">
              <Label>Категория</Label>
              <select name="categoryId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Цена и Признак расчета */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Цена (₽)</Label>
              <Input type="number" name="price" required placeholder="500" />
            </div>
            <div className="space-y-2">
              <Label>Признак расчета</Label>
              <select name="paymentSubject" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="COMMODITY">Товар</option>
                <option value="EXCISE">Подакцизный товар</option>
                <option value="SERVICE">Услуга</option>
              </select>
            </div>
          </div>

          {/* 3. Вес ИЛИ Объем */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="mb-2 block">Размер порции</Label>
            <div className="flex gap-4 mb-2">
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="radio" name="measureType" value="weight" checked={measureType === "weight"} onChange={() => setMeasureType("weight")} /> Вес
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="radio" name="measureType" value="volume" checked={measureType === "volume"} onChange={() => setMeasureType("volume")} /> Объем
               </label>
            </div>
            <Input name="measureValue" placeholder={measureType === "weight" ? "300 г" : "0.5 л"} />
          </div>

          {/* 4. КБЖУ */}
          <div className="grid grid-cols-4 gap-2">
            <div className="space-y-1"><Label>Ккал</Label><Input name="calories" type="number" step="0.1" /></div>
            <div className="space-y-1"><Label>Белки</Label><Input name="proteins" type="number" step="0.1" /></div>
            <div className="space-y-1"><Label>Жиры</Label><Input name="fats" type="number" step="0.1" /></div>
            <div className="space-y-1"><Label>Угл.</Label><Input name="carbohydrates" type="number" step="0.1" /></div>
          </div>

          {/* 5. Медиа (Фото и Видео) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label>Фото (загрузка с компьютера)</Label>
               <Input type="file" name="image" accept="image/*" />
             </div>
             <div className="space-y-2">
               <Label>Видео (ссылка)</Label>
               <Input name="video" placeholder="https://youtube.com/..." />
             </div>
          </div>

          {/* 6. Описание */}
          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea name="description" placeholder="Состав, особенности..." />
          </div>

          {/* Техническое */}
          <div className="grid grid-cols-3 gap-4 border-t pt-4">
             <div className="space-y-1"><Label>Артикул</Label><Input name="sku" /></div>
             <div className="space-y-1"><Label>Сортировка</Label><Input name="sortIndex" type="number" defaultValue="0" /></div>
             <div className="space-y-1"><Label>Бейдж</Label><Input name="badge" placeholder="Хит" /></div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isAvailable" id="isAvailable" defaultChecked className="w-4 h-4" />
            <Label htmlFor="isAvailable">Товар доступен для заказа</Label>
          </div>

          <Button type="submit" className="w-full">Создать товар</Button>
        </form>
      </CardContent>
    </Card>
  );
}