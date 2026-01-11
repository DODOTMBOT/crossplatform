import { getProducts } from "@/app/actions/products";
import { getToppings } from "@/app/actions/toppings"; // Импортируем получение топпингов
import { prisma } from "@/lib/prisma";
import ProductManager from "@/components/admin/ProductManager"; 
import { notFound } from "next/navigation";

export default async function AdminProductsPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: site }
  });

  if (!tenant) return notFound();

  const products = await getProducts(tenant.id);
  const categories = await prisma.category.findMany({
    where: { tenantId: tenant.id }
  });
  
  // Получаем все доступные топпинги (библиотеку)
  const allToppings = await getToppings(tenant.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Меню: {tenant.name}</h1>
      </div>
      
      <ProductManager 
        products={products} 
        categories={categories} 
        toppings={allToppings} // Передаем в компонент
        tenantId={tenant.id} 
      />
    </div>
  );
}