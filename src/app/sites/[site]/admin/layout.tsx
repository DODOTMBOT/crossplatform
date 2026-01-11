"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden md:flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Zdraste Admin</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {/* Обзор */}
          <AdminLink href="/admin" label="Обзор" />
          
          {/* Группа: Продукт */}
          <AdminGroup label="Продукт">
             <AdminLink href="/admin/products" label="Продукты" isChild />
             <AdminLink href="/admin/categories" label="Категории" isChild />
             <AdminLink href="/admin/toppings" label="Топинги" isChild />
          </AdminGroup>

          {/* Группа: Настройки сайта */}
          <AdminGroup label="Настройки сайта">
             <AdminLink href="/admin/banners" label="Баннеры" isChild />
             {/* Шапка сайта редактируется в общих настройках */}
             <AdminLink href="/admin/settings" label="Шапка сайта" isChild />
          </AdminGroup>
        </nav>

        <div className="p-4 border-t border-slate-100">
            <Link href="/" className="text-sm text-blue-600 hover:underline">← На сайт</Link>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

// Компонент раскрывающейся группы
function AdminGroup({ label, children }: { label: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true); 
  
  return (
    <div className="select-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-slate-800 font-bold rounded-lg hover:bg-slate-50 transition-colors"
      >
        <span>{label}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"
      )}>
        <div className="space-y-1">
          {children}
        </div>
      </div>
    </div>
  )
}

// Компонент ссылки
function AdminLink({ href, label, isChild }: { href: string; label: string, isChild?: boolean }) {
  const pathname = usePathname();
  
  // Проверяем активность ссылки (точное совпадение для корня или начало пути для вложенных)
  const isActive = href === "/admin" 
    ? pathname === "/admin" 
    : pathname?.startsWith(href);

  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm",
        isChild ? "pl-8 text-slate-500" : "text-slate-700",
        isActive ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      {label}
    </Link>
  );
}