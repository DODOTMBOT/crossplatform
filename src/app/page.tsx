import Header from "@/components/Header";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryNav from "@/components/home/CategoryNav";
import ProductCard from "@/components/home/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Получаем категории вместе с их товарами
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { isAvailable: true } // Показываем только доступные
      }
    },
    orderBy: { order: "asc" }
  });

  // Фильтруем пустые категории, чтобы не засорять главную
  const activeCategories = categories.filter(cat => cat.products.length > 0);

  return (
    <main className="min-h-screen pb-20 bg-white">
      <Header />
      <HeroSlider />
      
      {/* Передаем категории в навигацию (нужно будет чуть доработать CategoryNav, чтобы он принимал пропсы) */}
      <CategoryNav /> 

      <div className="container mx-auto px-4 mt-8 space-y-12">
        {activeCategories.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
                <p>Меню пока пустое 😔</p>
                <p className="text-sm mt-2">Зайдите в админку, создайте категории и добавьте товары.</p>
            </div>
        ) : (
            activeCategories.map((category) => (
            <section key={category.id} id={category.slug || category.id} className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">{category.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                {category.products.map((product) => (
                    <ProductCard 
                    key={product.id}
                    title={product.name}
                    price={product.price}
                    weight={product.weight || ""}
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