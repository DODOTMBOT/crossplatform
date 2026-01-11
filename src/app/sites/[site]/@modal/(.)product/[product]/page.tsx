import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import ProductDetails from "@/components/home/ProductDetails";

export default async function InterceptedProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: productId } = await params;

  const productData = await prisma.product.findUnique({
    where: { id: productId },
    include: { 
      modifierGroups: { include: { modifiers: true } },
      sizes: { orderBy: { price: 'asc' } },
      // ВАЖНО: Добавляем загрузку топпингов, чтобы не было ошибки
      productToppings: { include: { topping: true } } 
    }
  });

  if (!productData) return notFound();

  return (
    <Modal>
      <ProductDetails product={productData} />
    </Modal>
  );
}