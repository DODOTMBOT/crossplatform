import AuthForm from "@/components/auth/AuthForm";
import { Modal } from "@/components/ui/modal";

export default async function InterceptedLoginPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;

  return (
    // ПЕРЕДАЕМ CLASSNAME ДЛЯ УЗКОГО ОКНА
    <Modal className="max-w-[420px]">
      <div className="p-8 md:p-10">
        <AuthForm siteSlug={site} />
      </div>
    </Modal>
  );
}