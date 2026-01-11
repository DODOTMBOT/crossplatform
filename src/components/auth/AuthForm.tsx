"use client";

import { loginAction, registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState } from "react";

export default function AuthForm({ siteSlug }: { siteSlug: string }) {
  const [isRegister, setIsRegister] = useState(false);
  
  const [loginState, loginDispatch, isLoginPending] = useActionState(loginAction, null);
  const [regState, regDispatch, isRegPending] = useActionState(registerAction, null);

  const state = isRegister ? regState : loginState;
  const dispatch = isRegister ? regDispatch : loginDispatch;
  const isPending = isRegister ? isRegPending : isLoginPending;

  if (isRegister && regState?.success) {
     setIsRegister(false);
  }

  // УБРАЛИ <div className="bg-white shadow-xl ...">. Теперь это чистая форма.
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1C1C1C]">
          {isRegister ? "Регистрация" : "Вход"}
        </h2>
        <p className="text-sm text-gray-400 mt-2">
          {isRegister ? "Создайте аккаунт, чтобы делать заказы" : "Войдите, чтобы продолжить"}
        </p>
      </div>

      {state?.error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-500 text-sm rounded-xl text-center">
          {state.error}
        </div>
      )}
      
      {!isRegister && regState?.success && (
         <div className="mb-6 p-3 bg-green-50 border border-green-100 text-green-600 text-sm rounded-xl text-center">
           {regState.message}
         </div>
      )}

      <form action={dispatch} className="space-y-5">
        <input type="hidden" name="siteSlug" value={siteSlug} />

        {isRegister && (
          <div className="space-y-1.5">
            <Label className="text-gray-600 font-medium">Ваше имя</Label>
            <Input name="name" placeholder="Иван" required className="h-12 bg-gray-50 border-transparent focus:bg-white transition-all rounded-xl" />
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-gray-600 font-medium">Email</Label>
          <Input name="email" type="email" placeholder="hello@example.com" required className="h-12 bg-gray-50 border-transparent focus:bg-white transition-all rounded-xl" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-gray-600 font-medium">Пароль</Label>
          <Input name="password" type="password" required className="h-12 bg-gray-50 border-transparent focus:bg-white transition-all rounded-xl" />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base rounded-xl bg-[#FF6900] hover:bg-[#E65E00] text-white shadow-lg shadow-orange-200 transition-all mt-2" 
          disabled={isPending}
        >
          {isPending ? "Загрузка..." : (isRegister ? "Зарегистрироваться" : "Войти")}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-gray-500">
          {isRegister ? "Уже есть аккаунт? " : "Нет аккаунта? "}
        </span>
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="font-bold text-[#FF6900] hover:text-[#E65E00] transition-colors"
        >
          {isRegister ? "Войти" : "Создать аккаунт"}
        </button>
      </div>
    </div>
  );
}