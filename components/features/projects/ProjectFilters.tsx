// components/features/projects/project-filters.tsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Tag as TagIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectTag } from '@/types/project';

// ✅ FIXED: Custom type matching selected fields from query


interface ProjectFiltersProps {
  tags: ProjectTag[];
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
  const searchParams = useSearchParams();
  
  // ✅ Use ref for debounce timeout (not state)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // ✅ Track whether search change came from user or URL sync
  const isUserInputRef = useRef(false);
  
  // ✅ Local state for search input
  const [searchValue, setSearchValue] = useState(currentSearch || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // ✅ Sync URL to local state ONLY when change didn't come from user
  useEffect(() => {
    if (!isUserInputRef.current && currentSearch !== searchValue) {
      setSearchValue(currentSearch || '');
    }
    isUserInputRef.current = false;
  }, [currentSearch, searchValue]);

  // ✅ Debounced search handler
  const handleSearchSubmit = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    
    if (currentTag) params.set('tag', currentTag);
    if (currentCategory) params.set('category', currentCategory);
    
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.push(newPath);
  }, [router, pathname, searchParams, currentTag, currentCategory]);

  // ✅ Handle search input change with debounce
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

  // ✅ Handle form submit (Enter key) - immediate navigation
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    handleSearchSubmit(searchValue);
  };

  // ✅ Handle tag click with proper URL updates
  const handleTagClick = (tagSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (tagSlug === currentTag) {
      params.delete('tag');
    } else if (tagSlug) {
      params.set('tag', tagSlug);
    }
    
    if (currentSearch) params.set('search', currentSearch);
    if (currentCategory) params.set('category', currentCategory);
    
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.push(newPath);
  };

  // ✅ Handle category click
  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category === currentCategory) {
      params.delete('category');
    } else if (category) {
      params.set('category', category);
    }
    
    if (currentSearch) params.set('search', currentSearch);
    if (currentTag) params.set('tag', currentTag);
    
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.push(newPath);
  };

  // ✅ Clear all filters
  const clearFilters = () => {
    isUserInputRef.current = true;
    setSearchValue('');
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    router.push(pathname);
  };

  // ✅ Clear individual filters
  const clearSearchFilter = () => {
    isUserInputRef.current = true;
    setSearchValue('');
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    
    if (currentTag) params.set('tag', currentTag);
    if (currentCategory) params.set('category', currentCategory);
    
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newPath);
  };

  const clearTagFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tag');
    
    if (currentSearch) params.set('search', currentSearch);
    if (currentCategory) params.set('category', currentCategory);
    
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newPath);
  };

  const clearCategoryFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    
    if (currentSearch) params.set('search', currentSearch);
    if (currentTag) params.set('tag', currentTag);
    
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newPath);
  };

  const hasActiveFilters = currentTag || currentCategory || currentSearch;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8 space-y-4"
      role="search"
      aria-label="Project filters"
    >
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative" role="search">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" 
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search projects by title, description, or technology..."
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500"
          aria-label="Search projects"
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

      {/* Filter Toggle (Mobile) */}
      <div className="flex items-center justify-between md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="gap-2"
          aria-expanded={isFilterOpen}
          aria-controls="project-filters-content"
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

      {/* Filters Content */}
      <AnimatePresence>
        {(isFilterOpen || typeof window === 'undefined' || window.innerWidth >= 768) && (
          <motion.div
            id="project-filters-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={isFilterOpen ? 'block' : 'hidden md:block'}>
              {/* Categories */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2" id="categories-label">Categories</p>
                <div 
                  className="flex flex-wrap gap-2" 
                  role="group" 
                  aria-labelledby="categories-label"
                >
                  <Button
                    variant={!currentCategory ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryClick('')}
                    className="text-xs"
                    role="button"
                    aria-pressed={!currentCategory}
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
                      role="button"
                      aria-pressed={currentCategory === category}
                      aria-label={`Filter by ${category} category`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs text-gray-500 mb-2" id="tags-label">Technologies</p>
                <div 
                  className="flex flex-wrap gap-2" 
                  role="group" 
                  aria-labelledby="tags-label"
                >
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
                        {currentCategory && (
                          <Badge variant="secondary" className="gap-1">
                            Category: {currentCategory}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-400 transition-colors"
                              onClick={clearCategoryFilter}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && clearCategoryFilter()}
                              aria-label="Remove category filter"
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