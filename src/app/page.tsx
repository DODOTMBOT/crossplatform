import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTenant } from "@/app/actions/platform"; // Создадим ниже

export default async function PlatformDashboard() {
  const tenants = await prisma.tenant.findMany({
    include: { users: true }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-gray-900">🚀 Платформа Vibe</h1>

        {/* Форма создания нового клиента */}
        <Card>
          <CardHeader><CardTitle>Создать новый ресторан</CardTitle></CardHeader>
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

        {/* Список существующих */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => (
            <Card key={tenant.id}>
              <CardHeader>
                <CardTitle>{tenant.name}</CardTitle>
                <div className="text-sm text-blue-500 font-mono">{tenant.slug}.localhost:3000</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Админ: {tenant.users[0]?.email || "Нет"}</p>
                <a 
                  href={`http://${tenant.slug}.localhost:3000/admin`} 
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