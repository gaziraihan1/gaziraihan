// components/features/projects/project-pagination.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalProjects: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProjectPaginationProps {
  pagination: PaginationData;
  currentParams: Record<string, string>;
}

export function ProjectPagination({ pagination, currentParams }: ProjectPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(currentParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const { currentPage, totalPages } = pagination;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12 flex items-center justify-center gap-2"
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        disabled={!pagination.hasPrevPage}
        onClick={() => router.push(createPageURL(pagination.currentPage - 1))}
        className="disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={index} className="px-3 text-gray-500">
              ...
            </span>
          ) : (
            <Button
              key={index}
              variant={pagination.currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => router.push(createPageURL(page as number))}
              className="w-10 h-10 p-0"
            >
              {page}
            </Button>
          )
        )}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        disabled={!pagination.hasNextPage}
        onClick={() => router.push(createPageURL(pagination.currentPage + 1))}
        className="disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}