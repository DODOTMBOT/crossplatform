"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Получить категории ТОЛЬКО текущего ресторана
export async function getCategories(tenantId: string) {
  if (!tenantId) return [];

  return await prisma.category.findMany({
    where: { tenantId: tenantId },
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } }
  });
}

// 2. Создать категорию с привязкой к ресторану
export async function createCategory(formData: FormData) {
  const tenantId = formData.get("tenantId") as string;
  if (!tenantId) throw new Error("Tenant ID is required");

  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/ /g, "-"); 

  await prisma.category.create({
    data: {
      tenantId,
      name,
      slug,
      order: 0, 
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

// 3. Удалить категорию (безопасно)
export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    // Код P2003 в Prisma означает нарушение внешнего ключа (есть связанные записи)
    // Также проверяем текст ошибки на всякий случай
    if (error.code === 'P2003' || error.message?.includes('foreign key constraint')) {
        return { 
            success: false, 
            error: "Сначала удалите все товары из этой категории, потом можно будет удалить категорию." 
        };
    }
    return { success: false, error: "Произошла ошибка при удалении." };
  }
}