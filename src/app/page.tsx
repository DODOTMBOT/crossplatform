import Header from "@/components/Header";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryNav from "@/components/home/CategoryNav";
import ProductCard from "@/components/home/ProductCard";
import { getProducts } from "@/app/actions/products"; // Импортируем функцию

export default async function Home() {
  // Получаем товары с сервера
  const products = await getProducts();

  return (
    <main className="min-h-screen pb-20 bg-white">
      <Header />
      <HeroSlider />
      <CategoryNav />

      <div className="container mx-auto px-4 mt-8">
        <h2 className="text-3xl font-bold mb-6">Меню</h2>
        
        {/* Если товаров нет */}
        {products.length === 0 && (
          <p className="text-gray-500">Меню пока пустое. Добавьте товары в админке.</p>
        )}

        {/* Сетка товаров */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              title={product.name}
              price={product.price}
              weight={product.weight || "0 г"}
              // image={product.image} // Добавим картинки позже
            />
          ))}
        </div>
      </div>
    </main>
  );
}