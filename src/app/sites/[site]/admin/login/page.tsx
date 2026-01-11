import AuthForm from "@/components/auth/AuthForm";

export default async function LoginPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <AuthForm siteSlug={site} />
    </div>
  );
}