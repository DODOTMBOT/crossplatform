import { getProducts } from "@/app/actions/products";
import { prisma } from "@/lib/prisma";
import ProductManager from "@/components/admin/ProductManager"; // <-- Новый компонент
import { notFound } from "next/navigation";

export default async function AdminProductsPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;

  // 1. Узнаем, что это за ресторан
  const tenant = await prisma.tenant.findUnique({
    where: { slug: site }
  });

  if (!tenant) return notFound();

  // 2. Загружаем данные
  const products = await getProducts(tenant.id);
  const categories = await prisma.category.findMany({
    where: { tenantId: tenant.id }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Меню: {tenant.name}</h1>
      </div>
      
      {/* Вся логика переехала сюда */}
      <ProductManager 
        products={products} 
        categories={categories} 
        tenantId={tenant.id} 
      />
    </div>
  );
}