'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function BlogPostSkeleton() {
  return (
    <article className="lg:col-span-8">
      <div className="mb-8 space-y-4">
        <Skeleton className="h-4 w-32" /> 
        <Skeleton className="h-12 w-3/4" /> 
        <Skeleton className="h-6 w-full" /> 
        <Skeleton className="h-6 w-5/6" /> 
        
        <div className="flex items-center gap-4 text-sm">
          <Skeleton className="h-4 w-24" /> 
          <Skeleton className="h-4 w-2" /> 
          <Skeleton className="h-4 w-20" /> 
          <Skeleton className="h-4 w-2" /> 
          <Skeleton className="h-4 w-16" /> 
        </div>
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
        <Skeleton className="absolute inset-0" />
      </div>

      <div className="prose prose-invert max-w-none space-y-4">
        {[...Array(15)].map((_, i) => (
          <Skeleton 
            key={i} 
            className={`h-4 ${i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-5/6' : 'w-4/6'}`} 
          />
        ))}
      </div>

      <div className="lg:hidden mt-12 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </article>
  );
}