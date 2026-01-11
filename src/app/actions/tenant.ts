"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

async function saveFile(file: File, folder: string = "uploads"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
  const uploadDir = join(process.cwd(), "public", folder);
  
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, fileName), buffer);
  
  return `/${folder}/${fileName}`;
}

export async function updateTenantSettings(formData: FormData) {
  const tenantId = formData.get("tenantId") as string;
  if (!tenantId) throw new Error("Tenant ID missing");

  const name = formData.get("name") as string;
  const headerStyle = formData.get("headerStyle") as string; // "HERO" | "SIMPLE"
  const headerColor = formData.get("headerColor") as string;
  
  const headerImageFile = formData.get("headerImage") as File;
  const logoFile = formData.get("logo") as File;

  const data: any = { 
    name,
    headerStyle,
    headerColor
  };

  // Сохраняем фото шапки (баннер)
  if (headerImageFile && headerImageFile.size > 0) {
    data.headerImage = await saveFile(headerImageFile);
  }

  // Сохраняем логотип
  if (logoFile && logoFile.size > 0) {
    data.logoUrl = await saveFile(logoFile);
  }

  await prisma.tenant.update({
    where: { id: tenantId },
    data: data,
  });

  revalidatePath("/");
  revalidatePath(`/admin/settings`);
}