import { Package, LayoutDashboard, Layers, Image as ImageIcon, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Боковое меню (Sidebar) */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Zdraste Admin</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <AdminLink href="/admin" icon={<LayoutDashboard size={20} />} label="Обзор" />
          <AdminLink href="/admin/products" icon={<Package size={20} />} label="Товары" />
          <AdminLink href="/admin/categories" icon={<Layers size={20} />} label="Категории" />
          <AdminLink href="/admin/banners" icon={<ImageIcon size={20} />} label="Баннеры" />
          <div className="pt-4 mt-4 border-t border-slate-100">
            <AdminLink href="/admin/settings" icon={<Settings size={20} />} label="Настройки сайта" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
            <Link href="/" className="text-sm text-blue-600 hover:underline">← На сайт</Link>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

// Компонент ссылки меню
function AdminLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
    >
      {icon}
      {label}
    </Link>
  );
}