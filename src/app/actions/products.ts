"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function getProducts(tenantId: string) {
  if (!tenantId) return [];
  return await prisma.product.findMany({
    where: { tenantId },
    include: { 
      category: true,
      sizes: { orderBy: { price: 'asc' } } // Подгружаем размеры
    },
    orderBy: { sortIndex: "asc" },
  });
}

async function saveFile(file: File, folder: string = "uploads"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
  const uploadDir = join(process.cwd(), "public", folder);
  
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, fileName), buffer);
  
  return `/${folder}/${fileName}`;
}

// Хелпер для получения булевого значения
const getBool = (formData: FormData, key: string) => {
  const val = formData.get(key);
  return val === "true" || val === "on";
};

export async function createProduct(formData: FormData) {
  const tenantId = formData.get("tenantId") as string;
  if (!tenantId) throw new Error("Tenant ID is missing");

  const data = await processFormData(formData);
  const sizesJson = formData.get("sizes") as string; // Получаем JSON строку размеров

  const product = await prisma.product.create({
    data: {
      tenantId,
      ...data,
      // Создаем размеры, если они есть
      sizes: sizesJson ? {
        create: JSON.parse(sizesJson).map((s: any) => ({
          name: s.name,
          price: Number(s.price)
        }))
      } : undefined
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Product ID is missing");

  const data = await processFormData(formData);
  const sizesJson = formData.get("sizes") as string;

  // 1. Обновляем основные данные продукта
  await prisma.product.update({
    where: { id },
    data: data,
  });

  // 2. Обновляем размеры (стратегия: удалить старые, создать новые)
  // Это проще и надежнее для списков, где нет сложной логики связей
  if (sizesJson) {
    const sizes = JSON.parse(sizesJson);
    
    // Удаляем все старые размеры
    await prisma.productSize.deleteMany({
      where: { productId: id }
    });

    // Создаем новые
    if (sizes.length > 0) {
      await prisma.productSize.createMany({
        data: sizes.map((s: any) => ({
          productId: id,
          name: s.name,
          price: Number(s.price)
        }))
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

async function processFormData(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  
  const measureType = formData.get("measureType") as string;
  const measureValue = formData.get("measureValue") as string;
  let weight = null;
  let volume = null;
  if (measureType === "weight") weight = measureValue;
  if (measureType === "volume") volume = measureValue;

  const calories = Number(formData.get("calories") || 0);
  const proteins = Number(formData.get("proteins") || 0);
  const fats = Number(formData.get("fats") || 0);
  const carbohydrates = Number(formData.get("carbohydrates") || 0);

  const imageFile = formData.get("image") as File;
  const videoFile = formData.get("video") as File;

  let imagePath: string | undefined;
  let videoPath: string | undefined;

  if (imageFile && imageFile.size > 0) {
    imagePath = await saveFile(imageFile);
    videoPath = ""; 
  }

  if (videoFile && videoFile.size > 0) {
    videoPath = await saveFile(videoFile);
    imagePath = ""; 
  }

  const badge = formData.get("badge") as string;
  const sku = formData.get("sku") as string;
  const sortIndex = Number(formData.get("sortIndex") || 0);
  
  const isAvailable = getBool(formData, "isAvailable");
  const isArchived = getBool(formData, "isArchived");
  const isMarked = getBool(formData, "isMarkedValue") || getBool(formData, "isMarked");

  const paymentSubject = formData.get("paymentSubject") as string || "COMMODITY";

  const result: any = {
    name,
    price,
    categoryId,
    description,
    paymentSubject,
    weight,
    volume,
    badge,
    sku,
    sortIndex,
    calories,
    proteins,
    fats,
    carbohydrates,
    isAvailable,
    isArchived,
    isMarked,
  };

  if (imagePath !== undefined) result.image = imagePath;
  if (videoPath !== undefined) result.video = videoPath;

  return result;
}