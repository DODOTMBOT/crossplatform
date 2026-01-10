import { getProducts, deleteProduct } from "@/app/actions/products";
import { prisma } from "@/lib/prisma"; // Нужно для получения категорий
import CreateProductForm from "@/components/admin/CreateProductForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const categories = await prisma.category.findMany(); // Получаем категории для формы

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Товары ({products.length})</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка: Список товаров */}
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.price} ₽</TableCell>
                  <TableCell>{product.category?.name || "—"}</TableCell>
                  <TableCell className="text-right">
                    <form action={deleteProduct.bind(null, product.id)}>
                        <Button variant="destructive" size="icon" className="h-8 w-8">
                            <Trash className="w-4 h-4" />
                        </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Правая колонка: Форма добавления */}
        <div>
            <CreateProductForm categories={categories} />
            
            {/* Подсказка, если категорий нет */}
            {categories.length === 0 && (
                <p className="text-red-500 text-sm mt-2">
                    Сначала создайте категории через Prisma Studio или вкладку "Категории"!
                </p>
            )}
        </div>
      </div>
    </div>
  );
}