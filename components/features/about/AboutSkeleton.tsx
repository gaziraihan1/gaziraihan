// components/features/about/AboutSkeleton.tsx
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface AboutSkeletonProps {
  section?: 'experience' | 'skills' | 'education' | 'all';
}

export function AboutSkeleton({ section = 'all' }: AboutSkeletonProps) {
  if (section === 'experience') {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" /> {/* Section title */}
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-4/6" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (section === 'skills') {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white/5 border-white/10">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Skeleton className="w-4 h-4 rounded" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-2 flex-1 rounded-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Default: Full page skeleton
  return (
    <div className="space-y-20">
      {/* Hero Skeleton */}
      <div className="text-center space-y-6">
        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>

      {/* Bio Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Experience Skeleton */}
      {section === 'all' && <AboutSkeleton section="experience" />}

      {/* Skills Skeleton */}
      {section === 'all' && <AboutSkeleton section="skills" />}
    </div>
  );
}