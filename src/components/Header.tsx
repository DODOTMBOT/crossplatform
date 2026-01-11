import { Menu, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeaderProps {
  variant?: "default" | "transparent"; 
  backgroundColor?: string; 
  logoUrl?: string | null;
  siteName?: string;
  siteSlug?: string; // <-- Добавили (можно сделать необязательным ?)
}

export default function Header({ 
  variant = "default", 
  backgroundColor = "#1C1C1C", 
  logoUrl, 
  siteName = "ZDRASTE",
  siteSlug // Принимаем, даже если не используем прямо в верстке (или используем для ссылок)
}: HeaderProps) {
  
  const isTransparent = variant === "transparent";

  return (
    <header 
      className={cn(
        "top-0 left-0 right-0 z-50 py-3 px-4 transition-all",
        isTransparent ? "absolute bg-transparent" : "fixed shadow-lg rounded-b-[24px]"
      )}
      style={{
        backgroundColor: isTransparent ? "transparent" : backgroundColor
      }}
    >
      <div className="container mx-auto flex items-center justify-between text-white">
        
        {/* Левая часть (Меню) */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
        
        {/* Центр (Логотип или Текст) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={siteName} 
              className="h-10 w-auto object-contain" 
            />
          ) : (
            <div className="text-lg font-bold tracking-wide text-white drop-shadow-md">
              {siteName}
            </div>
          )}
        </div>
        
        {/* Правая часть */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 rounded-full hidden sm:flex"
            asChild
          >
            {/* Ссылка на вход. Middleware сам поймет, что это админка текущего сайта */}
            <Link href="/admin/login" scroll={false}>
              <User className="w-5 h-5 mr-2" /> Войти
            </Link>
          </Button>

          <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-4">
            <ShoppingBag className="w-5 h-5 mr-2" /> 0 ₽
          </Button>
        </div>
      </div>
    </header>
  );
}