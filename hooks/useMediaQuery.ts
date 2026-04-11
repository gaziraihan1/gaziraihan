// hooks/useMediaQuery.ts
'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const mediaQueryList = window.matchMedia(query);
      setMatches(mediaQueryList.matches);
      
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };
      
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', listener);
      } else {
        mediaQueryList.addListener(listener);
      }
      
      return () => {
        if (mediaQueryList.removeEventListener) {
          mediaQueryList.removeEventListener('change', listener);
        } else {
          mediaQueryList.removeListener(listener);
        }
      };
    } catch (error) {
      // ✅ Fallback if matchMedia fails (rare on mobile)
      console.warn('matchMedia failed:', error);
      setMatches(defaultValue);
    }
  }, [query, defaultValue]);
  
  return matches;
}