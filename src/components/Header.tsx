import { Menu, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1C1C1C] text-white py-3 px-4 rounded-b-[28px] shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
        <div className="text-lg font-bold tracking-wide">ZDRASTE</div>
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