"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Helper function to save files (same as in products.ts)
async function saveFile(file: File, folder: string = "uploads"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `topping-${Date.now()}-${file.name.replaceAll(" ", "_")}`;
  const uploadDir = join(process.cwd(), "public", folder);
  
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, fileName), buffer);
  
  return `/${folder}/${fileName}`;
}

// 1. Get all toppings for a tenant
export async function getToppings(tenantId: string) {
  if (!tenantId) return [];
  return await prisma.topping.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

// 2. Create a new topping in the library
export async function createTopping(formData: FormData) {
  const tenantId = formData.get("tenantId") as string;
  const name = formData.get("name") as string;
  const file = formData.get("image") as File;

  if (!tenantId || !name || !file) throw new Error("Missing required fields");

  const imageUrl = await saveFile(file);

  await prisma.topping.create({
    data: {
      tenantId,
      name,
      image: imageUrl,
    },
  });

  revalidatePath("/admin/toppings");
}

// 3. Delete a topping
export async function deleteTopping(id: string) {
  await prisma.topping.delete({ where: { id } });
  revalidatePath("/admin/toppings");
}