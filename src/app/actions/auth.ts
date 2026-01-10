"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Ищем пользователя
  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: true } // Подгружаем инфо о ресторане
  });

  if (!user || !user.password) {
    return { error: "Неверный email или пароль" };
  }

  // 2. Проверяем пароль
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: "Неверный email или пароль" };
  }

  // 3. Создаем токен (билет на вход)
  const token = await new SignJWT({ 
    userId: user.id, 
    tenantId: user.tenantId, 
    role: user.role 
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  // 4. Сохраняем токен в куки
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  // 5. Перенаправляем в админку
  redirect("/admin");
}