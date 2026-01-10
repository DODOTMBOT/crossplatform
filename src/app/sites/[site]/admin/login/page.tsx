"use client";

import { loginAction } from "@/app/actions/auth"; // Создадим ниже
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";

export default function LoginPage() {
  // Используем useActionState для обработки ошибок (Next.js 15/React 19)
  // Если у вас старая версия, можно просто onSubmit
  const [state, action, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход в Админку</h1>
        
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input name="email" type="email" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <Input name="password" type="password" required />
          </div>

          {state?.error && (
            <p className="text-red-500 text-sm text-center">{state.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Вход..." : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
}