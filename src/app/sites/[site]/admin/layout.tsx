import { Package, LayoutDashboard, Layers, Image as ImageIcon, Settings, Pizza } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Zdraste Admin</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <AdminLink href="/admin" icon={<LayoutDashboard size={20} />} label="Overview" />
          <AdminLink href="/admin/products" icon={<Package size={20} />} label="Products" />
          <AdminLink href="/admin/categories" icon={<Layers size={20} />} label="Categories" />
          {/* NEW LINK */}
          <AdminLink href="/admin/toppings" icon={<Pizza size={20} />} label="Toppings" />
          
          <AdminLink href="/admin/banners" icon={<ImageIcon size={20} />} label="Banners" />
          <div className="pt-4 mt-4 border-t border-slate-100">
            <AdminLink href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
            <Link href="/" className="text-sm text-blue-600 hover:underline">← Go to Site</Link>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

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