"use client";

import { deleteCategory } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useTransition } from "react";

export default function CategoryDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Вы уверены, что хотите удалить эту категорию?")) return;

    startTransition(async () => {
      const result = await deleteCategory(id);
      
      if (!result.success) {
        // Показываем алерт, если сервер вернул ошибку
        alert(result.error);
      }
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash className="w-4 h-4" />
    </Button>
  );
}