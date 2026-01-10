import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash } from "lucide-react";

// Временные данные (потом заменим на prisma.product.findMany())
const products = [
  { id: 1, name: "Большой русский завтрак", price: 800, category: "Завтраки", status: "Активен" },
  { id: 2, name: "Капучино", price: 350, category: "Кофе", status: "Активен" },
  { id: 3, name: "Сырники", price: 490, category: "Десерты", status: "Скрыт" },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Товары</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Добавить товар
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="mb-4">
          <Input placeholder="Поиск товара..." className="max-w-sm" />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price} ₽</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${product.status === 'Активен' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {product.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon"><Pencil className="w-4 h-4" /></Button>
                  <Button variant="destructive" size="icon"><Trash className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}