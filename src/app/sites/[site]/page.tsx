import Header from "@/components/Header";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryNav from "@/components/home/CategoryNav";
import ProductCard from "@/components/home/ProductCard";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Category, Product } from "@prisma/client";

type CategoryWithProducts = Category & { products: Product[] };

export const dynamic = "force-dynamic";

export default async function TenantHome({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: site },
  });

  if (!tenant) return notFound();

  const banners = await prisma.banner.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" }
  });

  const categories = await prisma.category.findMany({
    where: { tenantId: tenant.id },
    include: {
      products: {
        where: { 
          isAvailable: true, 
          isArchived: false,
          tenantId: tenant.id 
        },
        orderBy: { sortIndex: "asc" }
      }
    },
    orderBy: { order: "asc" }
  });

  const activeCategories = categories.filter((cat) => cat.products.length > 0);

  // ОПРЕДЕЛЯЕМ РЕЖИМ ШАПКИ
  // Если выбран стиль HERO и есть картинка -> Transparent Header + Big Image
  // Иначе -> Colored Header (Simple)
  const isHeroMode = tenant.headerStyle === "HERO" && !!tenant.headerImage;

  return (
    <main className="min-h-screen pb-20 bg-white">
      
      {/* 1. ШАПКА */}
      <Header 
        variant={isHeroMode ? "transparent" : "default"}
        backgroundColor={tenant.headerColor} // Работает только если variant="default"
        logoUrl={tenant.logoUrl}
        siteName={tenant.name} 
      />
      
      {/* 2. БОЛЬШОЙ БАННЕР (Показываем только в режиме HERO) */}
      {isHeroMode && (
        <div className="w-full relative">
          <img 
            src={tenant.headerImage!} 
            alt="Header" 
            className="w-full h-[320px] md:h-[613px] object-cover object-center block" 
          />
        </div>
      )}

      {/* 3. КОНТЕНТ */}
      {/* Если режима HERO нет, добавляем отступ сверху, чтобы не залезть под шапку */}
      <div className={isHeroMode ? "" : "pt-24"}>
        
        <HeroSlider banners={banners} />
        <CategoryNav categories={activeCategories} />

        <div className="container mx-auto px-4 mt-12 space-y-16">
          <h1 className="text-4xl font-bold text-[#1C1C1C] mb-8">
            {tenant.name}
          </h1>
          
          {activeCategories.length === 0 ? (
            <div className="py-20 text-gray-500">
              <p>Меню пока пустое 😔</p>
              <p className="text-sm">Зайдите в админку и создайте товары.</p>
            </div>
          ) : (
            activeCategories.map((category: CategoryWithProducts) => (
              <section key={category.id} id={category.id} className="scroll-mt-32">
                <h2 className="text-3xl font-bold mb-8 text-[#1C1C1C]">
                  {category.name}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                  {category.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.name}
                      price={product.price}
                      weight={product.weight || product.volume || ""} 
                      image={product.image}
                      video={product.video}
                      badge={product.badge}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </main>
  );
}