"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// 1. Получаем товары
export async function getProducts(tenantId: string) {
  if (!tenantId) return [];
  return await prisma.product.findMany({
    where: { tenantId },
    include: { category: true },
    orderBy: { sortIndex: "asc" },
  });
}

// 2. Создаем товар (Обновлено)
export async function createProduct(formData: FormData) {
  const tenantId = formData.get("tenantId") as string;
  if (!tenantId) throw new Error("Tenant ID is missing");

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  
  // Новые поля
  const paymentSubject = formData.get("paymentSubject") as string || "COMMODITY";
  const measureType = formData.get("measureType") as string; // 'weight' или 'volume'
  const measureValue = formData.get("measureValue") as string;
  const video = formData.get("video") as string;

  // Обработка веса/объема
  let weight = null;
  let volume = null;
  if (measureType === "weight") weight = measureValue;
  if (measureType === "volume") volume = measureValue;

  // КБЖУ
  const calories = Number(formData.get("calories") || 0);
  const proteins = Number(formData.get("proteins") || 0);
  const fats = Number(formData.get("fats") || 0);
  const carbohydrates = Number(formData.get("carbohydrates") || 0);

  // --- Загрузка ФОТО ---
  const file = formData.get("image") as File;
  let imageUrl = "";

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, fileName), buffer);
    imageUrl = `/uploads/${fileName}`;
  }
  // ---------------------

  const badge = formData.get("badge") as string;
  const sku = formData.get("sku") as string;
  const iikoId = formData.get("iikoId") as string;
  const sortIndex = Number(formData.get("sortIndex") || 0);
  const isAvailable = formData.get("isAvailable") === "true"; // Чекбокс передает "true" только если нажат, иначе null (надо проверять наличие)
  
  await prisma.product.create({
    data: {
      tenantId,
      name,
      price,
      categoryId,
      description,
      paymentSubject,
      weight,
      volume,
      video,
      image: imageUrl,
      badge,
      sku,
      iikoId,
      sortIndex,
      calories,
      proteins,
      fats,
      carbohydrates,
      isAvailable: formData.get("isAvailable") === "on", // HTML checkbox sends "on"
      isArchived: false,
    },
  });

  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}