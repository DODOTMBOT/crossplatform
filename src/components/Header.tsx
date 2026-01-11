import { Menu, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant?: "default" | "transparent"; // default = цветной, transparent = прозрачный
  backgroundColor?: string; // Цвет для default режима
  logoUrl?: string | null;
  siteName?: string;
}

export default function Header({ 
  variant = "default", 
  backgroundColor = "#1C1C1C", 
  logoUrl, 
  siteName = "ZDRASTE" 
}: HeaderProps) {
  
  const isTransparent = variant === "transparent";

  return (
    <header 
      className={cn(
        "top-0 left-0 right-0 z-50 py-3 px-4 transition-all",
        // Если прозрачный - absolute (поверх фото). Если цветной - fixed (липкий)
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
              className="h-10 w-auto object-contain" // Ограничиваем высоту логотипа
            />
          ) : (
            <div className="text-lg font-bold tracking-wide text-white drop-shadow-md">
              {siteName}
            </div>
          )}
        </div>
        
        {/* Правая часть (Профиль и Корзина) */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full hidden sm:flex">
            <User className="w-5 h-5 mr-2" /> Войти
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-4">
            <ShoppingBag className="w-5 h-5 mr-2" /> 0 ₽
          </Button>
        </div>
      </div>
    </header>
  );
}