import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface BentoGridSkeletonProps {
  className?: string;
}

export function BentoGridSkeleton({ className }: BentoGridSkeletonProps) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/5 p-6", className)}>
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}