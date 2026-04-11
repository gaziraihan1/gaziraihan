// components/features/blog/BlogFilters.tsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Tag as TagIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
};

interface BlogFiltersProps {
  tags: BlogTag[];
  currentTag?: string;
  currentSearch?: string;
}

export function BlogFilters({ tags, currentTag, currentSearch }: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInputRef = useRef(false);
  
  const [searchValue, setSearchValue] = useState(currentSearch || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // ✅ FIX 1: Hydration-safe state for client-only checks
  const [hasMounted, setHasMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true); // Default to true for SSR

  // ✅ FIX 2: Defer window checks to useEffect (client-only)
  useEffect(() => {
    setHasMounted(true);
    setIsDesktop(window.innerWidth >= 768);
    
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize, { passive: true }); // ✅ passive: true improves scroll performance
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isUserInputRef.current && currentSearch !== searchValue) {
      setSearchValue(currentSearch || '');
    }
    isUserInputRef.current = false;
  }, [currentSearch, searchValue]);

  const handleSearchSubmit = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    
    if (currentTag) {
      params.set('tag', currentTag);
    }
    
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.push(newPath);
  }, [router, pathname, searchParams, currentTag]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    isUserInputRef.current = true;
    setSearchValue(newValue);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      handleSearchSubmit(newValue);
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    handleSearchSubmit(searchValue);
  };

  const handleTagClick = (tagSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (tagSlug === currentTag) {
      params.delete('tag');
    } else if (tagSlug) {
      params.set('tag', tagSlug);
    }
    
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.push(newPath);
  };

  const clearFilters = () => {
    isUserInputRef.current = true;
    setSearchValue('');
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    router.push(pathname);
  };

  const clearSearchFilter = () => {
    isUserInputRef.current = true;
    setSearchValue('');
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    
    if (currentTag) {
      params.set('tag', currentTag);
    }
    
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newPath);
  };

  const clearTagFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tag');
    
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newPath);
  };

  const hasActiveFilters = currentTag || currentSearch;

  // ✅ FIX 3: Hydration-safe conditional rendering
  // Server & initial client render: show filters (isDesktop = true by default)
  // After mount: use actual viewport width
  const shouldShowFilters = hasMounted ? (isFilterOpen || isDesktop) : true;

  // ✅ PERF 1: Simplify animations on mobile for better Lighthouse scores
  const motionProps = isDesktop
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.2, type: 'spring' as const, stiffness: 100, damping: 12 },
      }
    : {
        // ✅ Mobile: simpler, faster animation
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      };

  return (
    // ✅ PERF 2: Use CSS transitions for main wrapper (cheaper than Framer Motion)
    <div
      className="mb-8 space-y-4 transition-opacity duration-500"
      role="search"
      aria-label="Blog filters"
      // ✅ PERF 3: GPU acceleration hint for animations
      style={{ willChange: 'opacity, transform' }}
    >
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative" role="search">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" 
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search articles by title, content, or technology..."
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500"
          aria-label="Search blog posts"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => {
              isUserInputRef.current = true;
              setSearchValue('');
              clearSearchFilter();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1 rounded"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Filter Toggle (Mobile) - Only render on client after mount */}
      {hasMounted && !isDesktop && (
        <div className="flex items-center justify-between md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="gap-2"
            aria-expanded={isFilterOpen}
            aria-controls="tag-filters"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center" aria-label="Filters active">
                •
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              aria-label="Clear all filters"
            >
              Clear All
            </Button>
          )}
        </div>
      )}

      {/* Filters Content - Hydration-safe with AnimatePresence */}
      <AnimatePresence>
        {shouldShowFilters && (
          <motion.div
            id="tag-filters"
            // ✅ FIX 4: Prevent hydration warning for style mismatches
            suppressHydrationWarning
            // ✅ PERF 4: Use simplified motion props based on viewport
            {...motionProps}
            className="overflow-hidden"
            // ✅ PERF 5: GPU acceleration for smooth animations
            style={{ willChange: 'opacity, height' }}
          >
            {/* Desktop layout - always rendered for SSR, hidden on mobile via CSS */}
            <div className="hidden md:block">
              {/* Tags */}
              <div>
                <p className="text-xs text-gray-500 mb-2" id="tags-label">Technologies</p>
                <div 
                  className="flex flex-wrap gap-2" 
                  role="group" 
                  aria-labelledby="tags-label"
                >
                  <Badge
                    variant={!currentTag ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleTagClick('')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleTagClick('')}
                    aria-pressed={!currentTag}
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
                          ? { backgroundColor: tag.color || undefined, borderColor: tag.color || undefined }
                          : { borderColor: tag.color ? `${tag.color}40` : undefined, color: tag.color || undefined }
                      }
                      onClick={() => handleTagClick(tag.slug)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleTagClick(tag.slug)}
                      aria-pressed={currentTag === tag.slug}
                      aria-label={`Filter by ${tag.name}`}
                    >
                      <TagIcon className="w-3 h-3 mr-1" aria-hidden="true" />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pt-4 border-t border-white/10"
                    aria-live="polite"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">Active filters:</span>
                        {currentSearch && (
                          <Badge variant="secondary" className="gap-1">
                            Search: {currentSearch}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-400 transition-colors"
                              onClick={() => {
                                isUserInputRef.current = true;
                                clearSearchFilter();
                              }}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && clearSearchFilter()}
                              aria-label="Remove search filter"
                            />
                          </Badge>
                        )}
                        {currentTag && (
                          <Badge variant="secondary" className="gap-1">
                            Tag: {tags.find((t) => t.slug === currentTag)?.name || currentTag}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-400 transition-colors"
                              onClick={clearTagFilter}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && clearTagFilter()}
                              aria-label="Remove tag filter"
                            />
                          </Badge>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        aria-label="Clear all filters"
                      >
                        Clear All
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile layout - only rendered on client after mount */}
            {hasMounted && !isDesktop && isFilterOpen && (
              <div className="md:hidden">
                {/* Same tags content, mobile-styled */}
                <div>
                  <p className="text-xs text-gray-500 mb-2" id="tags-label-mobile">Technologies</p>
                  <div 
                    className="flex flex-wrap gap-2" 
                    role="group" 
                    aria-labelledby="tags-label-mobile"
                  >
                    <Badge
                      variant={!currentTag ? 'default' : 'outline'}
                      className="cursor-pointer transition-colors"
                      onClick={() => handleTagClick('')}
                      role="button"
                      tabIndex={0}
                      aria-pressed={!currentTag}
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
                            ? { backgroundColor: tag.color || undefined, borderColor: tag.color || undefined }
                            : { borderColor: tag.color ? `${tag.color}40` : undefined, color: tag.color || undefined }
                        }
                        onClick={() => handleTagClick(tag.slug)}
                        role="button"
                        tabIndex={0}
                        aria-pressed={currentTag === tag.slug}
                        aria-label={`Filter by ${tag.name}`}
                      >
                        <TagIcon className="w-3 h-3 mr-1" aria-hidden="true" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Mobile active filters */}
                {hasActiveFilters && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">Active filters:</span>
                        {currentSearch && (
                          <Badge variant="secondary" className="gap-1">
                            Search: {currentSearch}
                            <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={() => {
                                isUserInputRef.current = true;
                                clearSearchFilter();
                              }}
                              aria-label="Remove search filter"
                            />
                          </Badge>
                        )}
                        {currentTag && (
                          <Badge variant="secondary" className="gap-1">
                            Tag: {tags.find((t) => t.slug === currentTag)?.name || currentTag}
                            <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={clearTagFilter}
                              aria-label="Remove tag filter"
                            />
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear All
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}