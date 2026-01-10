"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

async function saveFile(file: File, folder: string = "uploads"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `header-${Date.now()}-${file.name.replaceAll(" ", "_")}`;
  const uploadDir = join(process.cwd(), "public", folder);
  
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, fileName), buffer);
  
  return `/${folder}/${fileName}`;
}

export async function updateTenantSettings(formData: FormData) {
  const tenantId = formData.get("tenantId") as string;
  const name = formData.get("name") as string;
  const file = formData.get("headerImage") as File;

  if (!tenantId) throw new Error("Tenant ID missing");

  const data: any = { name };

  if (file && file.size > 0) {
    const headerImageUrl = await saveFile(file);
    data.headerImage = headerImageUrl;
  }

  await prisma.tenant.update({
    where: { id: tenantId },
    data: data,
  });

  revalidatePath("/");
  revalidatePath(`/admin/settings`);
}