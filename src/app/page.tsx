import Header from "@/components/Header";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryNav from "@/components/home/CategoryNav";
import ProductCard from "@/components/home/ProductCard";

export default function Home() {
  return (
    <main className="min-h-screen pb-20 bg-white">
      {/* 1. Шапка */}
      <Header />

      {/* 2. Слайдер (с отступом сверху, так как шапка фиксирована) */}
      <HeroSlider />

      {/* 3. Категории */}
      <CategoryNav />

      {/* 4. Сетка товаров */}
      <div className="container mx-auto px-4 mt-8">
        <h2 className="text-3xl font-bold mb-6">Завтраки</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          <ProductCard title="Авокадо тост" price={450} weight="210 г" />
          <ProductCard title="Сырники со сметаной" price={390} weight="180 г" />
          <ProductCard title="Бенедикт с лососем" price={520} weight="240 г" />
          <ProductCard title="Овсяная каша" price={250} weight="300 г" />
          <ProductCard title="Круассан с ветчиной" price={410} weight="150 г" />
          <ProductCard title="Большой завтрак" price={650} weight="400 г" />
        </div>
      </div>
    </main>
  );
}