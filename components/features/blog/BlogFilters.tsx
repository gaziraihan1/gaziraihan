// components/features/blog/blog-filters.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, X, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag as TagType } from '@/generated/prisma/client';

interface BlogFiltersProps {
  tags: TagType[];
  currentTag?: string;
  currentSearch?: string;
}

export function BlogFilters({ tags, currentTag, currentSearch }: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(currentSearch || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchValue) params.set('search', searchValue);
      if (currentTag) params.set('tag', currentTag);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleTagClick = (tagSlug: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (currentSearch) params.set('search', currentSearch);
      if (tagSlug !== currentTag) params.set('tag', tagSlug);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearchValue('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = currentTag || currentSearch;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8 space-y-4"
    >
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search articles by title, content, or technology..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          disabled={isPending}
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            disabled={isPending}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Filter Toggle (Mobile) */}
      <div className="flex items-center justify-between md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="gap-2"
          disabled={isPending}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} disabled={isPending}>
            Clear All
          </Button>
        )}
      </div>

      {/* Tags Filter */}
      <div className={isFilterOpen ? 'block' : 'hidden md:block'}>
        <div>
          <p className="text-xs text-gray-500 mb-2">Topics</p>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={!currentTag ? 'default' : 'outline'}
              className="cursor-pointer transition-colors"
              onClick={() => handleTagClick('')}
            >
              All
            </Badge>
            {tags.slice(0, 12).map((tag) => (
              <Badge
                key={tag.id}
                variant={currentTag === tag.slug ? 'default' : 'outline'}
                className="cursor-pointer transition-colors"
                style={
                  currentTag === tag.slug
                    ? { backgroundColor: tag.color, borderColor: tag.color }
                    : { borderColor: tag.color + '40', color: tag.color }
                }
                onClick={() => handleTagClick(tag.slug)}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">Active filters:</span>
                {currentSearch && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {currentSearch}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => {
                        setSearchValue('');
                        const params = new URLSearchParams();
                        if (currentTag) params.set('tag', currentTag);
                        router.push(`${pathname}?${params.toString()}`);
                      }}
                    />
                  </Badge>
                )}
                {currentTag && (
                  <Badge variant="secondary" className="gap-1">
                    Tag: {tags.find((t) => t.slug === currentTag)?.name}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => {
                        const params = new URLSearchParams();
                        if (currentSearch) params.set('search', currentSearch);
                        router.push(`${pathname}?${params.toString()}`);
                      }}
                    />
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters} disabled={isPending}>
                Clear All
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}