// components/admin/MessagesSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function MessagesSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-full sm:max-w-md" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
      
      {/* Table Skeleton */}
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <Table className="min-w-175">
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, i) => (
              <TableRow key={i} className="border-white/10">
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}