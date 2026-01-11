import { createTopping, deleteTopping, getToppings } from "@/app/actions/toppings";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import { notFound } from "next/navigation";

export default async function AdminToppingsPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: site }
  });

  if (!tenant) return notFound();

  const toppings = await getToppings(tenant.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Toppings Library</h1>
      <p className="text-gray-500">Create toppings here to attach them to products later.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CREATE FORM */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>New Topping</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createTopping} className="flex flex-col gap-6">
              <input type="hidden" name="tenantId" value={tenant.id} />
              
              <div className="space-y-2">
                <Label>Name (e.g., Bacon)</Label>
                <Input name="name" required placeholder="Bacon" />
              </div>

              <div className="space-y-2">
                <Label>Image (PNG, transparent background)</Label>
                <Input type="file" name="image" accept="image/*" required />
              </div>

              <Button type="submit" className="w-full">Add to Library</Button>
            </form>
          </CardContent>
        </Card>

        {/* TOPPINGS LIST */}
        <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4 text-lg">Available Toppings ({toppings.length})</h3>
            
            {toppings.length === 0 && (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-400">
                    Library is empty. Create your first topping.
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {toppings.map((topping) => (
                  <div key={topping.id} className="relative group bg-white rounded-xl border p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all">
                    <div className="w-16 h-16 relative">
                        <img 
                          src={topping.image} 
                          alt={topping.name} 
                          className="w-full h-full object-contain"
                        />
                    </div>
                    <span className="font-medium text-center text-sm">{topping.name}</span>
                    
                    <form action={deleteTopping.bind(null, topping.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="destructive" size="icon" className="h-6 w-6 rounded-full">
                            <Trash className="w-3 h-3" />
                        </Button>
                    </form>
                  </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}