import { getProducts, deleteProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash } from "lucide-react";

export default async function AdminProductsPage() {
  // Получаем реальные данные из базы
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Товары ({products.length})</h1>
        {/* Кнопку добавления сделаем позже */}
        <Button>Добавить товар</Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-4">
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
                <TableCell>{product.category?.name || "Без категории"}</TableCell>
                <TableCell className="text-right">
                  {/* Форма для удаления */}
                  <form action={deleteProduct.bind(null, product.id)}>
                    <Button variant="destructive" size="icon">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}