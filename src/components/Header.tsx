import { Menu, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant?: "default" | "transparent"; // default = черный фиксированный, transparent = прозрачный абсолютный
  siteName?: string;
}

export default function Header({ variant = "default", siteName = "ZDRASTE" }: HeaderProps) {
  const isTransparent = variant === "transparent";

  return (
    <header 
      className={cn(
        "top-0 left-0 right-0 z-50 py-4 px-4 transition-all",
        // Если прозрачный - absolute (чтобы не занимать место и лежать поверх фото)
        // Если обычный - fixed (чтобы висеть сверху при скролле)
        isTransparent ? "absolute bg-transparent" : "fixed bg-[#1C1C1C] shadow-lg rounded-b-[28px]"
      )}
    >
      <div className="container mx-auto flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="text-lg font-bold tracking-wide text-white drop-shadow-md">
          {siteName}
        </div>
        
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