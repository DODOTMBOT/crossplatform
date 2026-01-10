"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createTenant(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Хэшируем пароль (превращаем "123456" в "fd876s87df6s...")
  const hashedPassword = await bcrypt.hash(password, 10);

  // Создаем ресторан и админа одним махом
  await prisma.tenant.create({
    data: {
      name,
      slug,
      users: {
        create: {
          email,
          password: hashedPassword,
          role: "ADMIN"
        }
      }
    }
  });

  revalidatePath("/");
}