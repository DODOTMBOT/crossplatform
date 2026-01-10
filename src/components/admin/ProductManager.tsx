"use client";

import { createProduct, updateProduct, deleteProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, Pencil, Plus, FileVideo, Image as ImageIcon, ArrowUpDown } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Category, Product } from "@prisma/client";
import { cn } from "@/lib/utils"; // Убедитесь, что у вас есть этот утилитарный файл (стандартный для shadcn)

type ProductWithCategory = Product & { category: Category | null };

interface Props {
  products: ProductWithCategory[];
  categories: Category[];
  tenantId: string;
}

type SortConfig = {
  key: "name" | "price" | "category" | null;
  direction: "asc" | "desc";
};

export default function ProductManager({ products, categories, tenantId }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "name", direction: "asc" }); // Сортировка по умолчанию

  const initialFormState = {
    name: "",
    price: "",
    categoryId: categories.length > 0 ? categories[0].id : "",
    measureType: "weight",
    measureValue: "",
    description: "",
    badge: "",
    sku: "",
    sortIndex: "0",
    calories: "0",
    proteins: "0",
    fats: "0",
    carbohydrates: "0",
    mediaType: "image",
    isAvailable: true,
    isArchived: false,
    // isMarked удален
    paymentSubject: "COMMODITY"
  };

  const [formData, setFormData] = useState(initialFormState);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // --- СОРТИРОВКА ---
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (!sortConfig.key) return sorted;

    return sorted.sort((a, b) => {
      let aValue: any = "";
      let bValue: any = "";

      if (sortConfig.key === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortConfig.key === "price") {
        aValue = a.price;
        bValue = b.price;
      } else if (sortConfig.key === "category") {
        aValue = a.category?.name.toLowerCase() || "";
        bValue = b.category?.name.toLowerCase() || "";
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [products, sortConfig]);

  const handleSort = (key: "name" | "price" | "category") => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // --- ЛОГИКА ФОРМЫ ---

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleEdit = (product: ProductWithCategory) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: String(product.price),
      categoryId: product.categoryId,
      measureType: product.volume ? "volume" : "weight",
      measureValue: product.volume || product.weight || "",
      description: product.description || "",
      badge: product.badge || "",
      sku: product.sku || "",
      sortIndex: String(product.sortIndex),
      calories: String(product.calories || 0),
      proteins: String(product.proteins || 0),
      fats: String(product.fats || 0),
      carbohydrates: String(product.carbohydrates || 0),
      mediaType: product.video ? "video" : "image",
      isAvailable: product.isAvailable,
      isArchived: product.isArchived,
      paymentSubject: product.paymentSubject
    });
  };

  useEffect(() => {
    const p = parseFloat(formData.proteins) || 0;
    const f = parseFloat(formData.fats) || 0;
    const c = parseFloat(formData.carbohydrates) || 0;
    const kcal = (p * 4) + (f * 9) + (c * 4);
    setFormData(prev => ({ ...prev, calories: kcal.toFixed(1) }));
  }, [formData.proteins, formData.fats, formData.carbohydrates]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 6) {
          alert("Видео должно быть не длиннее 5 секунд!");
          if (videoInputRef.current) videoInputRef.current.value = "";
        }
      }
      video.src = URL.createObjectURL(file);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newState = { ...prev, [field]: value };

      // Логика взаимоисключения Активен/Архив
      if (field === "isAvailable" && value === true) {
        newState.isArchived = false;
      }
      if (field === "isArchived" && value === true) {
        newState.isAvailable = false;
      }

      return newState;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* ЛЕВАЯ КОЛОНКА: Список товаров */}
      <div className="bg-white rounded-xl border shadow-sm p-4 h-fit max-h-[calc(100vh-100px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Список блюд</h3>
          <Button size="sm" variant="outline" onClick={resetForm}>
            <Plus className="w-4 h-4 mr-2" /> Новый
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:text-black transition-colors" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">Блюдо <ArrowUpDown className="w-3 h-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer hover:text-black transition-colors" onClick={() => handleSort("category")}>
                <div className="flex items-center gap-1">Категория <ArrowUpDown className="w-3 h-3" /></div>
              </TableHead>
              <TableHead className="text-right cursor-pointer hover:text-black transition-colors" onClick={() => handleSort("price")}>
                <div className="flex items-center gap-1 justify-end">Price <ArrowUpDown className="w-3 h-3" /></div>
              </TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow 
                key={product.id} 
                className={cn(
                  editingId === product.id ? "bg-blue-50" : "",
                  // Визуальное выделение скрытых (неактивных) товаров
                  !product.isAvailable ? "opacity-50 grayscale bg-gray-50/50" : ""
                )}
              >
                <TableCell className="py-3 font-medium">
                  {product.name}
                  {!product.isAvailable && <span className="ml-2 text-[10px] text-red-500 font-bold border border-red-200 px-1 rounded">OFF</span>}
                </TableCell>
                <TableCell className="text-xs text-gray-500">
                  {product.category?.name || "—"}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">{product.price} ₽</TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button 
                      variant="ghost" size="icon" 
                      className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <form action={deleteProduct.bind(null, product.id)}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50">
                          <Trash className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ПРАВАЯ КОЛОНКА: Форма */}
      <div className="lg:col-span-2 bg-white p-5 rounded-xl border shadow-sm h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {editingId ? `Редактирование: ${formData.name}` : "Создание нового товара"}
          </h2>
          <div className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
            formData.isAvailable 
              ? "bg-green-100 text-green-700" 
              : formData.isArchived 
                ? "bg-orange-100 text-orange-700"
                : "bg-gray-100 text-gray-500"
          }`}>
            {formData.isAvailable ? "В МЕНЮ" : formData.isArchived ? "В АРХИВЕ" : "СКРЫТО"}
          </div>
        </div>

        <form action={editingId ? updateProduct : createProduct}>
          <input type="hidden" name="tenantId" value={tenantId} />
          {editingId && <input type="hidden" name="id" value={editingId} />}
          
          {Object.entries(formData).map(([key, value]) => (
             key !== 'calories' && key !== 'proteins' && key !== 'fats' && key !== 'carbohydrates' && 
             <input key={key} type="hidden" name={key} value={String(value)} />
          ))}

          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="main">Основное</TabsTrigger>
              <TabsTrigger value="props">КБЖУ</TabsTrigger>
              <TabsTrigger value="media">Медиа</TabsTrigger>
              <TabsTrigger value="tech">Настройки</TabsTrigger>
            </TabsList>

            <TabsContent value="main" forceMount={true} hidden={false} className="space-y-4 data-[state=inactive]:hidden">
              <div className="grid grid-cols-1 gap-2">
                <Label>Название блюда</Label>
                <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Цена (₽)</Label>
                  <Input type="number" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Категория</Label>
                  <select 
                    value={formData.categoryId}
                    onChange={(e) => handleChange("categoryId", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2 bg-gray-50 p-3 rounded">
                 <Label className="mb-2 block">Размер порции</Label>
                 <div className="flex gap-4 mb-2">
                   <label className="flex items-center gap-2 cursor-pointer text-sm">
                     <input type="radio" name="measureTypeGroup" checked={formData.measureType === "weight"} onChange={() => handleChange("measureType", "weight")} /> Вес
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer text-sm">
                     <input type="radio" name="measureTypeGroup" checked={formData.measureType === "volume"} onChange={() => handleChange("measureType", "volume")} /> Объем
                   </label>
                 </div>
                 <Input value={formData.measureValue} onChange={(e) => handleChange("measureValue", e.target.value)} placeholder={formData.measureType === "weight" ? "300 г" : "0.5 л"} />
              </div>
            </TabsContent>

            <TabsContent value="props" forceMount={true} className="space-y-4 data-[state=inactive]:hidden">
               <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm text-blue-700">
                 💡 Калорийность рассчитывается автоматически
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <Label>Белки (г)</Label>
                     <Input name="proteins" type="number" step="0.1" value={formData.proteins} onChange={(e) => handleChange("proteins", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                     <Label>Жиры (г)</Label>
                     <Input name="fats" type="number" step="0.1" value={formData.fats} onChange={(e) => handleChange("fats", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                     <Label>Углеводы (г)</Label>
                     <Input name="carbohydrates" type="number" step="0.1" value={formData.carbohydrates} onChange={(e) => handleChange("carbohydrates", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                     <Label className="text-green-600 font-bold">Ккалории</Label>
                     <Input name="calories" type="number" value={formData.calories} readOnly className="bg-gray-100 font-bold text-green-700" />
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="media" forceMount={true} className="space-y-4 data-[state=inactive]:hidden">
              <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
                <Button type="button" variant={formData.mediaType === "image" ? "default" : "ghost"} size="sm" onClick={() => handleChange("mediaType", "image")}>
                  <ImageIcon className="w-4 h-4 mr-2" /> Фото
                </Button>
                <Button type="button" variant={formData.mediaType === "video" ? "default" : "ghost"} size="sm" onClick={() => handleChange("mediaType", "video")}>
                  <FileVideo className="w-4 h-4 mr-2" /> Видео
                </Button>
              </div>

              <div className={formData.mediaType === "image" ? "block" : "hidden"}>
                  <Label>Загрузить фото</Label>
                  <Input type="file" name="image" accept="image/*" />
              </div>
              
              <div className={formData.mediaType === "video" ? "block" : "hidden"}>
                  <Label>Загрузить видео (до 5 сек)</Label>
                  <Input ref={videoInputRef} type="file" name="video" accept="video/*" onChange={handleVideoChange} />
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Описание товара</Label>
                <Textarea value={formData.description} onChange={(e) => handleChange("description", e.target.value)} className="h-24" />
              </div>
               <div className="space-y-2">
                 <Label>Бейдж</Label>
                 <Input value={formData.badge} onChange={(e) => handleChange("badge", e.target.value)} placeholder="HIT, NEW" />
              </div>
            </TabsContent>

            <TabsContent value="tech" forceMount={true} className="space-y-4 data-[state=inactive]:hidden">
               <div className="flex flex-col gap-4 bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                     <Label>Активен (В меню)</Label>
                     <Switch checked={formData.isAvailable} onCheckedChange={(v) => handleChange("isAvailable", v)} />
                  </div>
                  <div className="flex items-center justify-between">
                     <Label>В архиве</Label>
                     <Switch checked={formData.isArchived} onCheckedChange={(v) => handleChange("isArchived", v)} />
                  </div>
                  {/* ЧЕСТНЫЙ ЗНАК УБРАН ПО ЗАПРОСУ */}
               </div>
               <div className="space-y-2">
                   <Label>Признак расчета</Label>
                   <select value={formData.paymentSubject} onChange={(e) => handleChange("paymentSubject", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                     <option value="COMMODITY">Товар</option>
                     <option value="EXCISE">Подакцизный товар</option>
                     <option value="SERVICE">Услуга</option>
                   </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label>Сортировка</Label>
                      <Input type="number" value={formData.sortIndex} onChange={(e) => handleChange("sortIndex", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <Label>Артикул (SKU)</Label>
                      <Input value={formData.sku} onChange={(e) => handleChange("sku", e.target.value)} />
                  </div>
               </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
            {editingId && (
              <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>Отмена</Button>
            )}
            <Button type="submit" className="flex-[2] bg-[#1C1C1C] hover:bg-[#333]">
              {editingId ? "Сохранить изменения" : "Создать товар"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}