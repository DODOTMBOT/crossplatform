import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTenant } from "@/app/actions/platform";

export default async function PlatformDashboard({ searchParams }: { searchParams: Promise<{ secret?: string }> }) {
  const tenants = await prisma.tenant.findMany({
    include: { users: true }
  });
  
  const { secret } = await searchParams;
  // Простая защита от посторонних. Чтобы создать ресторан, нужно зайти на prsmx.ru/?secret=admin123
  const isAdmin = secret === "admin123"; 

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-gray-900">🚀 Платформа Vibe</h1>

        {/* Форма создания (Скрыта от обычных глаз) */}
        {isAdmin ? (
            <Card className="border-orange-500 border-2">
            <CardHeader><CardTitle>👑 Создать новый ресторан</CardTitle></CardHeader>
            <CardContent>
                <form action={createTenant} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" placeholder="Название (например: Додо Пицца)" required />
                <Input name="slug" placeholder="Субдомен (например: dodo)" required />
                <Input name="email" type="email" placeholder="Email администратора" required />
                <Input name="password" type="password" placeholder="Пароль администратора" required />
                <Button type="submit" className="md:col-span-2">Создать и выдать доступы</Button>
                </form>
            </CardContent>
            </Card>
        ) : (
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg">
                Чтобы создать новый ресторан, обратитесь к администратору платформы.
            </div>
        )}

        {/* Список существующих */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => (
            <Card key={tenant.id}>
              <CardHeader>
                <CardTitle>{tenant.name}</CardTitle>
                <div className="text-sm text-blue-500 font-mono">
                    <a href={`http://${tenant.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`} target="_blank">
                        {tenant.slug}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                    </a>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Админ: {tenant.users[0]?.email || "Нет"}</p>
                <a 
                  href={`http://${tenant.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/admin`} 
                  target="_blank"
                  className="mt-4 block text-center bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700"
                >
                  Перейти в админку
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}