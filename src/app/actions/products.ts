"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Получить товары ресторана
export async function getProducts(tenantId: string) {
  if (!tenantId) return [];
  
  return await prisma.product.findMany({
    where: { tenantId }, 
    include: { category: true },
    orderBy: { sortIndex: "asc" },
  });
}

// 2. Создать товар
export async function createProduct(formData: FormData) {
  const tenantId = formData.get("tenantId") as string;
  if (!tenantId) throw new Error("Tenant ID is missing");

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  const weight = formData.get("weight") as string;
  const image = formData.get("image") as string;
  const badge = formData.get("badge") as string;
  const sku = formData.get("sku") as string;
  const iikoId = formData.get("iikoId") as string;
  
  const sortIndex = Number(formData.get("sortIndex") || 0);
  const calories = Number(formData.get("calories") || 0);
  const proteins = Number(formData.get("proteins") || 0);
  const fats = Number(formData.get("fats") || 0);
  const carbohydrates = Number(formData.get("carbohydrates") || 0);

  const isAvailable = formData.get("isAvailable") === "true";
  const isArchived = formData.get("isArchived") === "true";
  const isMarked = formData.get("isMarkedValue") === "on";

  await prisma.product.create({
    data: {
      tenantId, // Привязка
      name,
      price,
      categoryId,
      description,
      weight,
      image: image || "",
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
}

// 3. Удалить товар
export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}