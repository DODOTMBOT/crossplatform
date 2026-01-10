import { createBanner, deleteBanner, getBanners } from "@/app/actions/banners";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash, Link as LinkIcon } from "lucide-react";
import { notFound } from "next/navigation";

export default async function AdminBannersPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: site }
  });

  if (!tenant) return notFound();

  const banners = await getBanners(tenant.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Баннеры: {tenant.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ФОРМА ЗАГРУЗКИ */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Добавить новый</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createBanner} className="flex flex-col gap-6">
              {/* Скрытый ID ресторана */}
              <input type="hidden" name="tenantId" value={tenant.id} />
              
              <div className="space-y-2">
                <Label>Изображение</Label>
                <Input type="file" name="image" accept="image/*" required />
                <p className="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-100">
                  📷 <b>Рекомендуемый размер:</b><br/>
                  Ширина: 600-800px<br/>
                  Высота: 300-400px<br/>
                  (Или горизонтальные 1200x400)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Ссылка (куда ведет клик)</Label>
                <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input name="link" placeholder="https://... или /category/sushi" className="pl-9"/>
                </div>
                <p className="text-xs text-gray-400">Оставьте пустым, если баннер не кликабельный</p>
              </div>

              <Button type="submit" className="w-full">Загрузить баннер</Button>
            </form>
          </CardContent>
        </Card>

        {/* СПИСОК БАННЕРОВ */}
        <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4 text-lg">Активные баннеры ({banners.length})</h3>
            
            {banners.length === 0 && (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-400">
                    Нет загруженных баннеров
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="group relative rounded-xl overflow-hidden border shadow-sm bg-white aspect-[16/9]">
                    <img 
                      src={banner.image} 
                      alt="Banner" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Оверлей с кнопкой удаления */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                       {banner.link && (
                         <div className="text-white text-xs bg-white/20 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1">
                           <LinkIcon size={10} /> {banner.link}
                         </div>
                       )}
                       <form action={deleteBanner.bind(null, banner.id)}>
                          <Button variant="destructive" size="sm" className="h-8">
                            <Trash className="w-4 h-4 mr-2" /> Удалить
                          </Button>
                       </form>
                    </div>
                  </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}