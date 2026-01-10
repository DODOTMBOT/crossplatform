import Header from "@/components/Header";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryNav from "@/components/home/CategoryNav";
import ProductCard from "@/components/home/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { isAvailable: true, isArchived: false }, // Не показываем архивные
        orderBy: { sortIndex: "asc" }
      }
    },
    orderBy: { order: "asc" }
  });

  const activeCategories = categories.filter((cat) => cat.products.length > 0);

  return (
    <main className="min-h-screen pb-20 bg-white">
      <Header />
      <HeroSlider />
      <CategoryNav categories={activeCategories} />

      <div className="container mx-auto px-4 mt-8 space-y-12">
        {activeCategories.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Меню пока пустое. Зайдите в админку.
          </div>
        ) : (
          activeCategories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-32">
              <h2 className="text-3xl font-bold mb-6 text-[#1C1C1C]">{category.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {category.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.name}
                    price={product.price}
                    weight={product.weight || ""}
                    image={product.image} // Передаем картинку
                    badge={product.badge} // Передаем бейдж
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}