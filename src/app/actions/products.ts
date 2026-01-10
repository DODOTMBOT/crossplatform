"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  return await prisma.product.findMany({
    include: { category: true },
    orderBy: { sortIndex: "asc" }, // Сортируем по твоему новому полю
  });
}

export async function createProduct(formData: FormData) {
  // Получаем данные из формы
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("categoryId") as string;
  
  // Текст
  const description = formData.get("description") as string;
  const weight = formData.get("weight") as string;
  const image = formData.get("image") as string;
  const badge = formData.get("badge") as string;
  const sku = formData.get("sku") as string;
  const iikoId = formData.get("iikoId") as string;
  
  // Числа (если пусто, будет 0)
  const sortIndex = Number(formData.get("sortIndex") || 0);
  const calories = Number(formData.get("calories") || 0);
  const proteins = Number(formData.get("proteins") || 0);
  const fats = Number(formData.get("fats") || 0);
  const carbohydrates = Number(formData.get("carbohydrates") || 0);

  // Логические поля (checkbox передает "on" или ничего, но мы хитрили с hidden input)
  // В твоей форме Switch передает значение через скрытые инпуты isAvailable / isArchived
  const isAvailable = formData.get("isAvailable") === "true";
  const isArchived = formData.get("isArchived") === "true";
  const isMarked = formData.get("isMarkedValue") === "on"; 

  await prisma.product.create({
    data: {
      name,
      price,
      categoryId,
      description,
      weight,
      image: image || "/placeholder-food.jpg",
      badge,
      sku,
      iikoId,
      sortIndex,
      calories,
      proteins,
      fats,
      carbohydrates,
      isAvailable,
      isArchived,
      isMarked,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}