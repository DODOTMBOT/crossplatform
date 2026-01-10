import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductDetails from "@/components/home/ProductDetails";

export default async function ProductPage({ params }: { params: Promise<{ site: string; product: string }> }) {
  const { site, product: productId } = await params;
  
  const tenant = await prisma.tenant.findUnique({
    where: { slug: site }
  });

  if (!tenant) return notFound();

  const productData = await prisma.product.findUnique({
    where: { id: productId },
    include: { modifierGroups: { include: { modifiers: true } } }
  });

  if (!productData) return notFound();

  // На внутренней странице товара можно не показывать огромное фото шапки, 
  // или показывать. Сделаем стандартную черную шапку для удобства чтения.
  // Если хотите фото - поменяйте variant="default" на логику как в page.tsx

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Header 
        variant="default" 
        siteName={tenant.name}
      />
      
      <div className="container mx-auto px-4 mt-24 max-w-4xl">
        <Link href={`/`} className="inline-flex items-center text-gray-500 hover:text-black mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Назад в меню
        </Link>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden min-h-[600px] border border-gray-100">
           <ProductDetails product={productData} />
        </div>
      </div>
    </main>
  );
}