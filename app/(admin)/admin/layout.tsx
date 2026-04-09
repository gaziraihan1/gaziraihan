// app/(admin)/admin/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    // ✅ FIXED: Prevent horizontal overflow on entire page
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <div className="flex min-h-screen">
        <AdminSidebar />
        
        {/* ✅ FIXED: Main content area - responsive margin + overflow protection */}
        <div className="flex-1 ml-0 min-w-0 mx-auto flex flex-col">
          <AdminHeader user={session.user} />
          
          {/* ✅ FIXED: Main content with proper overflow handling */}
          <main className="flex-1 p-4 md:p-8 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}