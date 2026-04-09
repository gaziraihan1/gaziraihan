// components/features/projects/project-filters.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, X, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag as TagType } from '../../../generated/prisma/client';

interface ProjectFiltersProps {
  tags: TagType[];
  categories: string[];
  currentTag?: string;
  currentCategory?: string;
  currentSearch?: string;
}

export function ProjectFilters({
  tags,
  categories,
  currentTag,
  currentCategory,
  currentSearch,
}: ProjectFiltersProps) {
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
      if (currentCategory) params.set('category', currentCategory);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleTagClick = (tagSlug: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (currentSearch) params.set('search', currentSearch);
      if (tagSlug !== currentTag) params.set('tag', tagSlug);
      if (currentCategory) params.set('category', currentCategory);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleCategoryClick = (category: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (currentSearch) params.set('search', currentSearch);
      if (currentTag) params.set('tag', currentTag);
      if (category !== currentCategory) params.set('category', category);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearchValue('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = currentTag || currentCategory || currentSearch;

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
          placeholder="Search projects by title, description, or technology..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
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
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className={isFilterOpen ? 'block' : 'hidden md:block'}>
        {/* Categories */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Categories</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!currentCategory ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryClick('')}
              className="text-xs"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={currentCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryClick(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Technologies</p>
          <div className="flex flex-wrap gap-2">
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
                        if (currentCategory) params.set('category', currentCategory);
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
                        if (currentCategory) params.set('category', currentCategory);
                        router.push(`${pathname}?${params.toString()}`);
                      }}
                    />
                  </Badge>
                )}
                {currentCategory && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {currentCategory}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => {
                        const params = new URLSearchParams();
                        if (currentSearch) params.set('search', currentSearch);
                        if (currentTag) params.set('tag', currentTag);
                        router.push(`${pathname}?${params.toString()}`);
                      }}
                    />
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}