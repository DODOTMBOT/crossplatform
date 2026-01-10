import { getProducts, deleteProduct } from "@/app/actions/products";
import { prisma } from "@/lib/prisma";
import CreateProductForm from "@/components/admin/CreateProductForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { notFound } from "next/navigation";

// Получаем slug из URL
export default async function AdminProductsPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;

  // 1. Узнаем, что это за ресторан
  const tenant = await prisma.tenant.findUnique({
    where: { slug: site }
  });

  if (!tenant) return notFound();

  // 2. Загружаем данные ТОЛЬКО для этого ресторана
  const products = await getProducts(tenant.id);
  
  // Категории тоже фильтруем!
  const categories = await prisma.category.findMany({
    where: { tenantId: tenant.id }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Меню: {tenant.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Список */}
        <div className="bg-white rounded-xl border shadow-sm p-4 h-fit max-h-[calc(100vh-200px)] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Блюдо</TableHead>
                <TableHead className="text-right">Цена</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="py-3">
                    <div className="font-medium leading-tight">{product.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{product.category?.name || "—"}</div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">{product.price} ₽</TableCell>
                  <TableCell>
                    <form action={deleteProduct.bind(null, product.id)}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                            <Trash className="w-4 h-4" />
                        </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Форма: Передаем в нее tenantId */}
        <div className="lg:col-span-2">
            <CreateProductForm categories={categories} tenantId={tenant.id} />
        </div>
        
      </div>
    </div>
  );
}