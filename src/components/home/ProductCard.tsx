import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductProps { title: string; price: number; weight: string; }

export default function ProductCard({ title, price, weight }: ProductProps) {
  return (
    <div className="group flex flex-col gap-3">
      <div className="relative aspect-square bg-gray-100 rounded-[28px] overflow-hidden flex items-center justify-center text-gray-400">
        Фото
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg leading-6">{title}</h3>
        <p className="text-sm text-gray-400">{weight}</p>
      </div>
      <Button variant="secondary" className="w-full justify-between rounded-[20px] h-12 bg-gray-100 hover:bg-[#C38C7F] hover:text-white transition-all">
        <span className="font-bold text-md">{price} ₽</span>
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
}