import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductDetails from "@/components/home/ProductDetails";

export default async function ProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: productId } = await params;
  
  const productData = await prisma.product.findUnique({
    where: { id: productId },
    include: { modifierGroups: { include: { modifiers: true } } }
  });

  if (!productData) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="container mx-auto px-4 mt-24 max-w-4xl">
        <Link href={`/`} className="inline-flex items-center text-gray-500 hover:text-black mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Назад в меню
        </Link>

        {/* Рендерим карточку товара как отдельный блок, но без модалки */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden min-h-[600px] border border-gray-100">
           <ProductDetails product={productData} />
        </div>
      </div>
    </main>
  );
}