import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { auth } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // ✅ Check both session and role
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 ml-0 min-w-0 mx-auto flex flex-col">
          <AdminHeader user={session.user} />
          <main className="flex-1 p-4 md:p-8 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}