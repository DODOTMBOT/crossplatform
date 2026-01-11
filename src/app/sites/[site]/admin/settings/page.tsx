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
          <CardTitle>Внешний вид шапки</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateTenantSettings} className="space-y-8">
            <input type="hidden" name="tenantId" value={tenant.id} />

            <div className="space-y-2">
              <Label>Название заведения (используется если нет лого)</Label>
              <Input name="name" defaultValue={tenant.name} required />
            </div>

            {/* ВЫБОР СТИЛЯ */}
            <div className="space-y-3">
              <Label>Тип шапки</Label>
              <div className="flex flex-col gap-4 p-4 border rounded-xl bg-gray-50">
                
                {/* Вариант 1: HERO */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="headerStyle" 
                    value="HERO" 
                    defaultChecked={tenant.headerStyle === "HERO"}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-bold block">1. Большой баннер (Hero)</span>
                    <span className="text-sm text-gray-500">Красивое фото во всю ширину, шапка прозрачная поверх фото.</span>
                  </div>
                </label>

                {/* Вариант 2: SIMPLE */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="headerStyle" 
                    value="SIMPLE" 
                    defaultChecked={tenant.headerStyle === "SIMPLE"}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-bold block">2. Логотип + Цвет</span>
                    <span className="text-sm text-gray-500">Компактная шапка с вашим логотипом и заливкой цветом.</span>
                  </div>
                </label>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* НАСТРОЙКИ ДЛЯ HERO */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Для варианта "Баннер"</h3>
              <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <Label>Фото шапки (1920x613)</Label>
                {tenant.headerImage && (
                  <div className="mb-2 relative w-full h-[150px] rounded-md overflow-hidden bg-gray-100">
                    <img src={tenant.headerImage} alt="Header" className="w-full h-full object-cover object-center" />
                  </div>
                )}
                <Input type="file" name="headerImage" accept="image/*" />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* НАСТРОЙКИ ДЛЯ SIMPLE */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Для варианта "Логотип"</h3>
              <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                
                <div className="space-y-2">
                  <Label>Логотип (PNG/SVG)</Label>
                  {tenant.logoUrl && (
                    <div className="mb-2 w-32 h-32 rounded-md border flex items-center justify-center bg-gray-100">
                      <img src={tenant.logoUrl} alt="Logo" className="max-w-full max-h-full p-2 object-contain" />
                    </div>
                  )}
                  <Input type="file" name="logo" accept="image/*" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Цвет фона шапки</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        name="headerColor" 
                        defaultValue={tenant.headerColor || "#1C1C1C"} 
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        defaultValue={tenant.headerColor || "#1C1C1C"} 
                        className="font-mono"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <Button type="submit" className="w-full">Сохранить настройки</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}