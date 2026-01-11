"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Добавляем утилиту для слияния классов

export function Modal({ children, className }: { children: React.ReactNode, className?: string }) {
  const router = useRouter();
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => router.back(), 100); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-0">
      {/* Затемнение фона */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
      />
      
      {/* Само окно */}
      <div className={cn(
        "relative z-50 w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 p-0",
        // По умолчанию 4xl (для товаров), но можно перезаписать (например, max-w-sm для логина)
        className || "max-w-4xl max-h-[90vh] md:h-auto" 
      )}>
        
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 p-2 bg-white/50 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {children}
      </div>
    </div>
  );
}