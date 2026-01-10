"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Получить все категории
export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { order: "asc" }, // Сортируем по порядку
    include: { _count: { select: { products: true } } } // Считаем кол-во товаров
  });
}

// 2. Создать категорию
export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  // Генерируем slug из названия (просто транслит или lowercase для примера)
  const slug = name.toLowerCase().replace(/ /g, "-"); 

  await prisma.category.create({
    data: {
      name,
      slug,
      order: 0, // По умолчанию в начало
      // tenantId не нужен, если мы делаем простую версию без мульти-аренды пока
      // Но если схема требует tenantId (она у тебя опциональная?), то ок.
      // В твоей схеме tenantId опциональный, так что ошибки не будет.
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products"); // В товарах обновится выпадающий список
  revalidatePath("/");
}

// 3. Удалить категорию
export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/");
}