"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getSession } from "@/lib/session"; // Импортируем проверку сессии

// --- GET PRODUCTS ---
export async function getProducts(tenantId: string) {
  if (!tenantId) return [];
  return await prisma.product.findMany({
    where: { tenantId },
    include: { 
      category: true,
      sizes: { orderBy: { price: 'asc' } },
      productToppings: { include: { topping: true } }
    },
    orderBy: { sortIndex: "asc" },
  });
}

// --- FILE SAVE HELPER ---
async function saveFile(file: File, folder: string = "uploads"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
  const uploadDir = join(process.cwd(), "public", folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, fileName), buffer);
  return `/${folder}/${fileName}`;
}

const getBool = (formData: FormData, key: string) => {
  const val = formData.get(key);
  return val === "true" || val === "on";
};

// --- CREATE PRODUCT ---
export async function createProduct(formData: FormData) {
  // 1. Проверка авторизации
  const session = await getSession();
  if (!session) throw new Error("Не авторизован");

  const tenantId = formData.get("tenantId") as string;
  if (!tenantId) throw new Error("Tenant ID is missing");

  // 2. Проверка прав доступа к конкретному ресторану
  if (session.tenantId !== tenantId && session.role !== "ADMIN") {
     throw new Error("Нет доступа к этому ресторану");
  }

  const data = await processFormData(formData);
  const sizesJson = formData.get("sizes") as string;
  const toppingsJson = formData.get("productToppings") as string;

  await prisma.product.create({
    data: {
      tenantId,
      ...data,
      sizes: sizesJson ? {
        create: JSON.parse(sizesJson).map((s: any) => ({
          name: s.name,
          price: Number(s.price)
        }))
      } : undefined,
      productToppings: toppingsJson ? {
        create: JSON.parse(toppingsJson).map((t: any) => ({
          toppingId: t.toppingId,
          price: Number(t.price),
          weight: t.weight
        }))
      } : undefined
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}

// --- UPDATE PRODUCT ---
export async function updateProduct(formData: FormData) {
  // 1. Проверка авторизации
  const session = await getSession();
  if (!session) throw new Error("Не авторизован");

  const id = formData.get("id") as string;
  if (!id) throw new Error("Product ID is missing");

  // 2. Проверка владельца товара
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) throw new Error("Товар не найден");
  
  if (existingProduct.tenantId !== session.tenantId && session.role !== "ADMIN") {
      throw new Error("Доступ запрещен");
  }

  const data = await processFormData(formData);
  const sizesJson = formData.get("sizes") as string;
  const toppingsJson = formData.get("productToppings") as string;

  await prisma.product.update({
    where: { id },
    data: data,
  });

  // Обновление размеров (полная перезапись)
  if (sizesJson) {
    const sizes = JSON.parse(sizesJson);
    await prisma.productSize.deleteMany({ where: { productId: id } });
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

  // Обновление топпингов (полная перезапись связей)
  if (toppingsJson) {
    const toppings = JSON.parse(toppingsJson);
    await prisma.productTopping.deleteMany({ where: { productId: id } });
    if (toppings.length > 0) {
      await prisma.productTopping.createMany({
        data: toppings.map((t: any) => ({
          productId: id,
          toppingId: t.toppingId,
          price: Number(t.price),
          weight: t.weight
        }))
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
}

// --- DELETE PRODUCT ---
export async function deleteProduct(id: string) {
  // 1. Проверка авторизации
  const session = await getSession();
  if (!session) throw new Error("Не авторизован");

  // 2. Проверка владельца товара
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) return; // Уже удален или не существует

  if (existingProduct.tenantId !== session.tenantId && session.role !== "ADMIN") {
      throw new Error("Доступ запрещен");
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

// --- FORM DATA PROCESSING ---
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
    // Если загрузили фото, видео затираем (логика переключателя)
    videoPath = ""; 
  }

  if (videoFile && videoFile.size > 0) {
    videoPath = await saveFile(videoFile);
    // Если загрузили видео, фото затираем
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