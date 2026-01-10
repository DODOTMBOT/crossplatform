import { createCategory, deleteCategory, getCategories } from "@/app/actions/categories";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash } from "lucide-react";
import { notFound } from "next/navigation";

// Получаем параметры страницы (slug сайта)
export default async function AdminCategoriesPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;

  // 1. Находим текущий ресторан
  const tenant = await prisma.tenant.findUnique({
    where: { slug: site }
  });

  if (!tenant) return notFound();

  // 2. Передаем ID ресторана в функцию получения категорий
  const categories = await getCategories(tenant.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Категории: {tenant.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Форма создания */}
        <Card>
          <CardHeader>
            <CardTitle>Добавить категорию</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createCategory} className="flex flex-col gap-4">
              {/* ВАЖНО: Скрытое поле с ID ресторана */}
              <input type="hidden" name="tenantId" value={tenant.id} />
              
              <Input name="name" placeholder="Название (например: Супы)" required />
              <Button type="submit">Создать</Button>
            </form>
          </CardContent>
        </Card>

        {/* Список категорий */}
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Товаров</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 h-24">
                      Список пуст
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell className="text-gray-400 text-sm">{cat.slug}</TableCell>
                      <TableCell>{cat._count.products}</TableCell>
                      <TableCell className="text-right">
                        <form action={deleteCategory.bind(null, cat.id)}>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash className="w-4 h-4" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}