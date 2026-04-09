// components/performance/page-load-tracker.tsx
'use client';

import { useEffect } from 'react';

export function PageLoadTracker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        // Send performance metrics to your analytics
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        };
        
        // Send to your analytics service
        // analytics.track('page_load', metrics);
        console.log('Page load metrics:', metrics);
      });
    }
  }, []);

  return null;
}