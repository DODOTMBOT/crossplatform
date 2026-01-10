import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateTenantSettings } from "@/app/actions/tenant";

export default async function AdminSettingsPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: site }
  });

  if (!tenant) return notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Настройки ресторана</h1>

      <Card>
        <CardHeader>
          <CardTitle>Основное</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateTenantSettings} className="space-y-6">
            <input type="hidden" name="tenantId" value={tenant.id} />

            <div className="space-y-2">
              <Label>Название заведения</Label>
              <Input name="name" defaultValue={tenant.name} required />
            </div>

            <div className="space-y-2">
              <Label>Фото шапки сайта</Label>
              
              {tenant.headerImage && (
                // Фиксируем высоту превью и используем object-cover
                <div className="mb-4 relative w-full h-[200px] rounded-xl overflow-hidden border bg-gray-100">
                  <img 
                    src={tenant.headerImage} 
                    alt="Current Header" 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}

              <Input type="file" name="headerImage" accept="image/*" />
              <p className="text-xs text-gray-500">
                Загрузите изображение (желательно горизонтальное). На сайте оно будет обрезано под формат баннера.
              </p>
            </div>

            <Button type="submit">Сохранить изменения</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}