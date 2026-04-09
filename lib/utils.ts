// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind classes conditionally.
 * Resolves conflicts between conflicting classes (e.g., mx-2 vs mx-4).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date relative to now (e.g., "2 hours ago")
 */
export function formatDate(date: Date) {
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    -Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)),
    'day'
  );
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}