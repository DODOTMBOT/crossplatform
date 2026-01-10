"use server"; // Обязательно: говорит Next.js, что это серверный код

import { prisma } from "@/lib/prisma"; // Убедись, что у тебя есть файл lib/prisma.ts (см. ниже)
import { revalidatePath } from "next/cache";

// 1. Получить все товары
export async function getProducts() {
  return await prisma.product.findMany({
    include: { category: true }, // Подгрузить категорию товара
    orderBy: { createdAt: "desc" },
  });
}

// 2. Создать товар
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("categoryId") as string;
  const weight = formData.get("weight") as string;

  await prisma.product.create({
    data: {
      name,
      price,
      categoryId,
      weight,
      image: "/placeholder-food.jpg", // Пока заглушка
    },
  });

  revalidatePath("/admin/products"); // Обновить админку
  revalidatePath("/"); // Обновить главную страницу
}

// 3. Удалить товар
export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}