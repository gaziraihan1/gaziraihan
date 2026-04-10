import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { Suspense } from 'react';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-white animate-pulse">Loading...</div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}