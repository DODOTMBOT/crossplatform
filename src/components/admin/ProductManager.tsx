"use client";

import { createProduct, updateProduct, deleteProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, Pencil, Plus, FileVideo, Image as ImageIcon, ArrowUpDown, X } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Category, Product, ProductSize, Topping, ProductTopping } from "@prisma/client"; // Добавили Topping, ProductTopping
import { cn } from "@/lib/utils";

// Расширяем тип продукта, добавляя productToppings
type ProductWithDetails = Product & { 
  category: Category | null;
  sizes: ProductSize[];
  productToppings: (ProductTopping & { topping: Topping })[];
};

interface Props {
  products: ProductWithDetails[];
  categories: Category[];
  toppings: Topping[]; // Библиотека топпингов
  tenantId: string;
}

type SortConfig = {
  key: "name" | "price" | "category" | null;
  direction: "asc" | "desc";
};

type SizeItem = {
  id?: string;
  name: string;
  price: string;
};

// Тип для выбранного топпинга в форме
type SelectedTopping = { 
  toppingId: string; 
  name: string; 
  image: string; 
  price: string; 
  weight: string; 
};

export default function ProductManager({ products, categories, toppings, tenantId }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "name", direction: "asc" });

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
    isMarked: false,
    paymentSubject: "COMMODITY"
  };

  const [formData, setFormData] = useState(initialFormState);
  
  // Состояние для размеров
  const [sizes, setSizes] = useState<SizeItem[]>([]);
  
  // Состояние для топпингов
  const [selectedToppings, setSelectedToppings] = useState<SelectedTopping[]>([]);
  const [selectedToppingIdToAdd, setSelectedToppingIdToAdd] = useState("");

  const videoInputRef = useRef<HTMLInputElement>(null);

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

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setSizes([]); 
    setSelectedToppings([]); // Сброс топпингов
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleEdit = (product: ProductWithDetails) => {
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
      isMarked: product.isMarked,
      paymentSubject: product.paymentSubject
    });
    
    // Загружаем размеры
    setSizes(product.sizes.map(s => ({
      id: s.id,
      name: s.name,
      price: String(s.price)
    })));

    // Загружаем топпинги
    setSelectedToppings(product.productToppings.map(pt => ({
        toppingId: pt.toppingId,
        name: pt.topping.name,
        image: pt.topping.image,
        price: String(pt.price),
        weight: pt.weight || ""
    })));
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
      if (field === "isAvailable" && value === true) newState.isArchived = false;
      if (field === "isArchived" && value === true) newState.isAvailable = false;
      return newState;
    });
  };

  // --- УПРАВЛЕНИЕ РАЗМЕРАМИ ---
  const addSize = () => {
    setSizes([...sizes, { name: "", price: "" }]);
  };

  const updateSize = (index: number, field: keyof SizeItem, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  const removeSize = (index: number) => {
    const newSizes = [...sizes];
    newSizes.splice(index, 1);
    setSizes(newSizes);
  };

  // --- УПРАВЛЕНИЕ ТОППИНГАМИ ---
  const addTopping = () => {
    if (!selectedToppingIdToAdd) return;
    
    // Находим топпинг в библиотеке
    const libTopping = toppings.find(t => t.id === selectedToppingIdToAdd);
    if (!libTopping) return;

    // Проверяем, не добавлен ли уже
    if (selectedToppings.find(t => t.toppingId === libTopping.id)) return;

    setSelectedToppings([...selectedToppings, {
        toppingId: libTopping.id,
        name: libTopping.name,
        image: libTopping.image,
        price: "0", // Дефолтная цена
        weight: ""
    }]);
    setSelectedToppingIdToAdd(""); // Сброс селекта
  };

  const updateTopping = (index: number, field: keyof SelectedTopping, value: string) => {
    const newToppings = [...selectedToppings];
    // @ts-ignore
    newToppings[index][field] = value;
    setSelectedToppings(newToppings);
  };

  const removeTopping = (index: number) => {
    const newToppings = [...selectedToppings];
    newToppings.splice(index, 1);
    setSelectedToppings(newToppings);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* ЛЕВАЯ КОЛОНКА */}
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
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">Блюдо</TableHead>
              <TableHead onClick={() => handleSort("category")} className="cursor-pointer">Категория</TableHead>
              <TableHead onClick={() => handleSort("price")} className="text-right cursor-pointer">Цена</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow 
                key={product.id} 
                className={cn(
                  editingId === product.id ? "bg-blue-50" : "",
                  !product.isAvailable ? "opacity-50 grayscale bg-gray-50/50" : ""
                )}
              >
                <TableCell className="py-3 font-medium">
                  {product.name}
                  {/* Показываем количество вариантов */}
                  {product.sizes.length > 0 && <span className="ml-2 text-[10px] bg-gray-100 px-1 rounded text-gray-600">{product.sizes.length} вар.</span>}
                </TableCell>
                <TableCell className="text-xs text-gray-500">{product.category?.name || "—"}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {product.sizes.length > 0 
                    ? `от ${Math.min(...product.sizes.map(s => s.price))} ₽` 
                    : `${product.price} ₽`}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700" onClick={() => handleEdit(product)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <form action={deleteProduct.bind(null, product.id)}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
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

      {/* ПРАВАЯ КОЛОНКА */}
      <div className="lg:col-span-2 bg-white p-5 rounded-xl border shadow-sm h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {editingId ? `Редактирование` : "Создание товара"}
          </h2>
          <div className={`px-3 py-1 rounded text-xs font-bold ${formData.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {formData.isAvailable ? "В МЕНЮ" : "СКРЫТО"}
          </div>
        </div>

        <form action={editingId ? updateProduct : createProduct}>
          <input type="hidden" name="tenantId" value={tenantId} />
          {editingId && <input type="hidden" name="id" value={editingId} />}
          <input type="hidden" name="isMarkedValue" value={formData.isMarked ? "on" : ""} />
          
          {/* JSON ДАННЫЕ */}
          <input type="hidden" name="sizes" value={JSON.stringify(sizes)} />
          <input type="hidden" name="productToppings" value={JSON.stringify(selectedToppings)} />
          
          {Object.entries(formData).map(([key, value]) => (
             key !== 'calories' && key !== 'proteins' && key !== 'fats' && key !== 'carbohydrates' && key !== 'isMarked' &&
             <input key={key} type="hidden" name={key} value={String(value)} />
          ))}

          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="main">Основное</TabsTrigger>
              <TabsTrigger value="toppings">Доп.инг.</TabsTrigger>
              <TabsTrigger value="props">КБЖУ</TabsTrigger>
              <TabsTrigger value="media">Медиа</TabsTrigger>
              <TabsTrigger value="tech">Настройки</TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <Label>Название блюда</Label>
                <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
              </div>
              
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                   <Label className="text-base font-semibold text-slate-800">Размеры и Вариации</Label>
                   <Button type="button" size="sm" variant="outline" onClick={addSize}>+ Добавить вариант</Button>
                </div>
                
                {sizes.length === 0 ? (
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Цена (Базовая)</Label>
                        <Input type="number" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} placeholder="0" />
                        <p className="text-xs text-gray-400">Укажите цену, если нет размеров.</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Размер порции (Общее)</Label>
                        <Input value={formData.measureValue} onChange={(e) => handleChange("measureValue", e.target.value)} placeholder="300 г" />
                      </div>
                   </div>
                ) : (
                   <div className="space-y-2">
                      <p className="text-xs text-orange-600 mb-2 font-medium">Базовая цена будет игнорироваться в пользу цен вариантов.</p>
                      {sizes.map((size, index) => (
                        <div key={index} className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
                           <Input 
                             placeholder="Название (25 см / S / 1 шт)" 
                             value={size.name} 
                             onChange={(e) => updateSize(index, "name", e.target.value)}
                             className="flex-1"
                           />
                           <Input 
                             type="number" 
                             placeholder="Цена ₽" 
                             value={size.price} 
                             onChange={(e) => updateSize(index, "price", e.target.value)}
                             className="w-24"
                           />
                           <Button type="button" variant="ghost" size="icon" onClick={() => removeSize(index)} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                             <X className="w-4 h-4" />
                           </Button>
                        </div>
                      ))}
                   </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2">
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
            </TabsContent>

            {/* ВКЛАДКА ТОППИНГОВ */}
            <TabsContent value="toppings" className="space-y-4">
                <div className="flex gap-2">
                    <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={selectedToppingIdToAdd}
                        onChange={(e) => setSelectedToppingIdToAdd(e.target.value)}
                    >
                        <option value="">Выберите топпинг из библиотеки...</option>
                        {toppings.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    <Button type="button" onClick={addTopping} disabled={!selectedToppingIdToAdd}>
                        <Plus className="w-4 h-4 mr-2" /> Добавить
                    </Button>
                </div>

                <div className="space-y-3 mt-4">
                    {selectedToppings.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                            Нет дополнительных ингредиентов
                        </div>
                    ) : (
                        selectedToppings.map((t, index) => (
                            <div key={index} className="flex items-center gap-3 bg-white border p-3 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
                                <img src={t.image} alt={t.name} className="w-10 h-10 object-contain rounded-md bg-gray-50" />
                                <div className="flex-1 font-medium text-sm">{t.name}</div>
                                
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col w-20">
                                        <span className="text-[10px] text-gray-400">Вес</span>
                                        <Input 
                                            className="h-8 text-xs" 
                                            placeholder="30 г" 
                                            value={t.weight} 
                                            onChange={(e) => updateTopping(index, "weight", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col w-20">
                                        <span className="text-[10px] text-gray-400">Цена ₽</span>
                                        <Input 
                                            type="number" 
                                            className="h-8 text-xs" 
                                            placeholder="0" 
                                            value={t.price} 
                                            onChange={(e) => updateTopping(index, "price", e.target.value)}
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="text-red-400 hover:bg-red-50 mt-3" onClick={() => removeTopping(index)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </TabsContent>

            <TabsContent value="props" className="space-y-4">
               <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm text-blue-700">
                 💡 КБЖУ указывается на 100г или на порцию (как принято у вас).
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <Label>Белки</Label>
                     <Input name="proteins" type="number" step="0.1" value={formData.proteins} onChange={(e) => handleChange("proteins", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                     <Label>Жиры</Label>
                     <Input name="fats" type="number" step="0.1" value={formData.fats} onChange={(e) => handleChange("fats", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                     <Label>Углеводы</Label>
                     <Input name="carbohydrates" type="number" step="0.1" value={formData.carbohydrates} onChange={(e) => handleChange("carbohydrates", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                     <Label className="text-green-600 font-bold">Ккалории</Label>
                     <Input name="calories" type="number" value={formData.calories} readOnly className="bg-gray-100 font-bold text-green-700" />
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
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

            <TabsContent value="tech" className="space-y-4">
               <div className="flex flex-col gap-4 bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                     <Label>Активен</Label>
                     <Switch checked={formData.isAvailable} onCheckedChange={(v) => handleChange("isAvailable", v)} />
                  </div>
                  <div className="flex items-center justify-between">
                     <Label>В архиве</Label>
                     <Switch checked={formData.isArchived} onCheckedChange={(v) => handleChange("isArchived", v)} />
                  </div>
                  <div className="flex items-center justify-between">
                     <Label>Честный знак</Label>
                     <Switch checked={formData.isMarked} onCheckedChange={(v) => handleChange("isMarked", v)} />
                  </div>
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