// app/(admin)/admin/uses/software/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { SoftwareTable } from '@/components/admin/SoftwareTable';
import { CreateSoftwareButton } from '@/components/admin/CreateSoftwareButton';

export const metadata: Metadata = {
  title: 'Software | Admin',
  description: 'Manage software and tools for your uses page.',
};

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export default async function SoftwarePage() {
  const software = await prisma.software.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });

  const groupedByCategory = software.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof software>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Software</h1>
          <p className="text-gray-400 mt-1">Manage your apps and tools</p>
        </div>
        <CreateSoftwareButton />
      </div>

      <Suspense fallback={<SoftwareTableSkeleton />}>
        <SoftwareTable softwareByCategory={groupedByCategory} />
      </Suspense>
    </div>
  );
}

function SoftwareTableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-lg border border-white/10 p-4 bg-white/5 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-32 mb-2" />
          <div className="space-y-2">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="h-16 bg-white/10 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}