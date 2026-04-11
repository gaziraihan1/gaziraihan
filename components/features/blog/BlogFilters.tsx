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

  useEffect(() => {
    return () => {
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
  }, [currentSearch, searchValue]); // ✅ Now depends on both to detect changes

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
    }, 300); // 300ms debounce
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8 space-y-4"
      role="search"
      aria-label="Blog filters"
    >
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

      <AnimatePresence>
        {(isFilterOpen || typeof window === 'undefined' || window.innerWidth >= 768) && (
          <motion.div
            id="tag-filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={isFilterOpen ? 'block' : 'hidden md:block'}>
              <div>
                <p className="text-xs text-gray-500 mb-2" id="topics-label">Topics</p>
                <div 
                  className="flex flex-wrap gap-2" 
                  role="group" 
                  aria-labelledby="topics-label"
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
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}