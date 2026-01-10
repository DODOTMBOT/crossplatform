"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
    // 1. Блокируем скролл основной страницы при открытии
    document.body.style.overflow = "hidden";

    // 2. Разблокируем при закрытии (когда компонент исчезнет)
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    // Небольшая задержка перед закрытием
    setTimeout(() => router.back(), 100); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0">
      {/* Затемнение фона */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
      />
      
      {/* Само окно */}
      <div className="relative z-50 w-full max-w-4xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] md:h-auto flex flex-col md:block animate-in fade-in zoom-in-95 duration-200 p-0">
        
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        {children}
      </div>
    </div>
  );
}