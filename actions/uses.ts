// actions/uses.ts
'use server';

import { prisma } from '@/lib/prisma';
// ✅ FIXED: Import cachedQuery (not cache.getOrSet)
import { cachedQuery } from '@/lib/cache';

// ✅ Type for skill with category grouping
export type UsesSkill = {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  proficiency: number;
  order: number;
};

// ✅ FIXED: UsesItem type with ALL properties components need
export type UsesItem = {
  name: string;
  description?: string;
  url?: string;
  image?: string;
  price?: string;
  isFavorite?: boolean;
  // ✅ Add missing properties:
  category?: string;
  isPaid?: boolean;
};

// ✅ Cache configuration
const USES_CACHE_KEY = 'uses:data';
const USES_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ✅ FIXED: Use cachedQuery helper (not cache.getOrSet)
export async function getUsesData() {
  return cachedQuery(
    USES_CACHE_KEY,
    async () => {
      console.log('🔍 Fetching uses page data...');
      const fetchStart = Date.now();
      
      // ✅ Fetch skills with selective fields (NO N+1)
      const skills = await prisma.skill.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          icon: true,
          proficiency: true,
          order: true,
        },
        where: { order: { gt: -1 } },
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      }) as UsesSkill[];
      
      // ✅ Group skills by category
      const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {} as Record<string, UsesSkill[]>);
      
      // ✅ Fetch hardware/software from SiteConfig (JSON values)
      const configEntries = await prisma.siteConfig.findMany({
        where: {
          key: {
            in: ['uses_hardware', 'uses_software', 'uses_workflow', 'uses_learning'],
          },
        },
        select: { key: true, value: true },
      });
      
      const configMap = Object.fromEntries(
        configEntries.map((entry) => [entry.key, JSON.parse(entry.value)])
      );
      
      const fetchTime = Date.now() - fetchStart;
      console.log(`✅ Fetched uses data in ${fetchTime}ms`);
      
      return {
        skillsByCategory,
        hardware: configMap.uses_hardware || [],
        software: configMap.uses_software || [],
        workflow: configMap.uses_workflow || [],
        learning: configMap.uses_learning || [],
      };
    },
    USES_CACHE_TTL
  );
}