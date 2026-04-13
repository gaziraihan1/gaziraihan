// app/(admin)/admin/uses/hardware/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { HardwareTable } from '@/components/admin/HardwareTable';
import { CreateHardwareButton } from '@/components/admin/CreateHardwareButton';

export const metadata: Metadata = {
  title: 'Hardware | Admin',
  description: 'Manage hardware and equipment for your uses page.',
};

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export default async function HardwarePage() {
  const hardware = await prisma.hardware.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });

  const groupedByCategory = hardware.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof hardware>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hardware</h1>
          <p className="text-gray-400 mt-1">Manage your equipment and devices</p>
        </div>
        <CreateHardwareButton />
      </div>

      <Suspense fallback={<HardwareTableSkeleton />}>
        <HardwareTable hardwareByCategory={groupedByCategory} />
      </Suspense>
    </div>
  );
}

function HardwareTableSkeleton() {
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