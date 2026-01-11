"use client";

import { loginAction, registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState } from "react";

export default function AuthForm({ siteSlug }: { siteSlug: string }) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Хуки для серверных экшенов
  const [loginState, loginDispatch, isLoginPending] = useActionState(loginAction, null);
  const [regState, regDispatch, isRegPending] = useActionState(registerAction, null);

  const state = isRegister ? regState : loginState;
  const dispatch = isRegister ? regDispatch : loginDispatch;
  const isPending = isRegister ? isRegPending : isLoginPending;

  // Если регистрация прошла успешно, переключаем на вход
  if (isRegister && regState?.success) {
     setIsRegister(false);
     // Можно добавить уведомление об успехе здесь
  }

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isRegister ? "Регистрация" : "Вход"}
      </h2>

      {state?.error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg">
          {state.error}
        </div>
      )}
      
      {/* Сообщение об успехе регистрации, если переключились на вход */}
      {!isRegister && regState?.success && (
         <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg">
           {regState.message}
         </div>
      )}

      <form action={dispatch} className="space-y-4">
        {/* Скрытое поле, чтобы передать slug сайта в экшен */}
        <input type="hidden" name="siteSlug" value={siteSlug} />

        {isRegister && (
          <div className="space-y-1">
            <Label>Ваше имя</Label>
            <Input name="name" placeholder="Иван" required />
          </div>
        )}

        <div className="space-y-1">
          <Label>Email</Label>
          <Input name="email" type="email" placeholder="hello@example.com" required />
        </div>

        <div className="space-y-1">
          <Label>Пароль</Label>
          <Input name="password" type="password" required />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#1C1C1C] hover:bg-[#333]" 
          disabled={isPending}
        >
          {isPending ? "Загрузка..." : (isRegister ? "Зарегистрироваться" : "Войти")}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">
          {isRegister ? "Уже есть аккаунт? " : "Нет аккаунта? "}
        </span>
        <button
          onClick={() => {
             setIsRegister(!isRegister);
             // Сбрасываем состояния ошибок при переключении (опционально)
          }}
          className="font-medium text-blue-600 hover:underline"
        >
          {isRegister ? "Войти" : "Создать аккаунт"}
        </button>
      </div>
    </div>
  );
}