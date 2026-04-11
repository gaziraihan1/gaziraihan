'use client';

import { useEffect } from 'react';

export function HomeMetrics() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const metrics = {
        ttfb: nav.responseStart - nav.requestStart,
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime,
        tti: performance.getEntriesByName('first-input-delay')[0]?.startTime,
      };
      
      console.log('📊 Home page metrics:', metrics);
    }
  }, []);

  return null;
}