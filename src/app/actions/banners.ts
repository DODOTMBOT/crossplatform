"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";

// 1. Получить баннеры конкретного ресторана
export async function getBanners(tenantId: string) {
  if (!tenantId) return [];
  return await prisma.banner.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

// 2. Загрузить баннер
export async function createBanner(formData: FormData) {
  const tenantId = formData.get("tenantId") as string;
  const link = formData.get("link") as string;
  const file = formData.get("image") as File;

  if (!file || file.size === 0) {
    throw new Error("Необходимо выбрать изображение");
  }

  // --- Логика сохранения файла локально ---
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Генерируем уникальное имя файла
  const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
  
  // Путь: public/uploads
  const uploadDir = join(process.cwd(), "public", "uploads");
  
  // Создаем папку, если её нет
  await mkdir(uploadDir, { recursive: true });
  
  // Сохраняем файл
  await writeFile(join(uploadDir, fileName), buffer);
  
  // Ссылка для веба
  const imageUrl = `/uploads/${fileName}`;
  // ---------------------------------------

  await prisma.banner.create({
    data: {
      tenantId,
      image: imageUrl,
      link: link || null,
    },
  });

  revalidatePath("/admin/banners"); // Обновляем админку
  revalidatePath("/"); // Обновляем главную страницу
}

// 3. Удалить баннер
export async function deleteBanner(id: string) {
  const banner = await prisma.banner.findUnique({ where: { id } });
  
  if (banner) {
    // Удаляем запись из базы
    await prisma.banner.delete({ where: { id } });
    
    // (Опционально) Можно добавить удаление файла с диска:
    // try {
    //   const filePath = join(process.cwd(), "public", banner.image);
    //   await unlink(filePath);
    // } catch (e) { console.error("Error deleting file", e) }
  }
  
  revalidatePath("/admin/banners");
  revalidatePath("/");
}