import AuthForm from "@/components/auth/AuthForm";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function LoginPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: site }
  });

  if (!tenant) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        siteName={tenant.name} 
        logoUrl={tenant.logoUrl} 
        siteSlug={tenant.slug}
        backgroundColor={tenant.headerColor} 
        variant="default"
      />
      
      <div className="flex-grow flex items-center justify-center p-4 pt-24">
        {/* Обертка-карточка для отдельной страницы */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-[420px]">
          <AuthForm siteSlug={site} />
        </div>
      </div>
    </div>
  );
}