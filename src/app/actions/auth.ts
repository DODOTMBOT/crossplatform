"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");

// --- РЕГИСТРАЦИЯ ---
export async function registerAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const siteSlug = formData.get("siteSlug") as string; // Получаем текущий сайт

  if (!email || !password || !siteSlug) {
    return { error: "Заполните все поля" };
  }

  // 1. Находим Tenant по слагу
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteSlug }
  });

  if (!tenant) return { error: "Ресторан не найден" };

  // 2. Проверяем, есть ли такой юзер ИМЕННО В ЭТОМ ТЕНАНТЕ
  const existingUser = await prisma.user.findUnique({
    where: {
      email_tenantId: {
        email: email,
        tenantId: tenant.id
      }
    }
  });

  if (existingUser) {
    return { error: "Пользователь с таким email уже существует в этом заведении" };
  }

  // 3. Создаем пользователя
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      tenantId: tenant.id,
      role: "USER" // Обычный пользователь (не админ)
    }
  });

  // Автоматически логиним после регистрации? Или просим войти.
  // Для простоты вернем успех, и пусть юзер войдет.
  return { success: true, message: "Регистрация успешна! Теперь войдите." };
}

// --- ВХОД ---
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const siteSlug = formData.get("siteSlug") as string;

  // 1. Находим Tenant
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteSlug }
  });

  if (!tenant) return { error: "Ресторан не найден" };

  // 2. Ищем пользователя ВНУТРИ этого Tenant
  // Благодаря составному ключу @@unique([email, tenantId])
  const user = await prisma.user.findUnique({
    where: {
      email_tenantId: {
        email: email,
        tenantId: tenant.id
      }
    }
  });

  if (!user || !user.password) {
    return { error: "Неверный email или пароль" };
  }

  // 3. Проверяем пароль
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: "Неверный email или пароль" };
  }

  // 4. Создаем токен
  const token = await new SignJWT({ 
    userId: user.id, 
    tenantId: user.tenantId, 
    role: user.role,
    email: user.email 
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  // 5. Сохраняем куку
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  redirect("/admin"); // Или на главную, если это вход для клиентов
}

// --- ВЫХОД ---
export async function logoutAction() {
  (await cookies()).delete("session");
  redirect("/");
}