// actions/uses.ts
'use server';

import { prisma } from '@/lib/prisma';
import { cachedQuery } from '@/lib/cache';
import { UsesSkill,UsesHardware, UsesSoftware } from '@/types/uses';


// ✅ Cache configuration
const USES_CACHE_KEY = 'uses:data';
const USES_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ✅ Fetch all uses data from correct sources
export async function getUsesData() {
  return cachedQuery(
    USES_CACHE_KEY,
    async () => {
      console.log('🔍 Fetching uses page data...');
      const fetchStart = Date.now();
      
      // ✅ 1. Fetch skills from Prisma (NO N+1)
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
      
      // ✅ 2. Fetch hardware from Hardware table (NOT SiteConfig)
      const hardware = await prisma.hardware.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          description: true,
          imageUrl: true,
          purchaseUrl: true,
          price: true,
          isFavorite: true,
          order: true,
        },
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      }) as UsesHardware[];
      
      // ✅ 3. Fetch software from Software table (NOT SiteConfig)
      const software = await prisma.software.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          description: true,
          websiteUrl: true,
          isPaid: true,
          isFavorite: true,
          order: true,
        },
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      }) as UsesSoftware[];
      
      // ✅ 4. Fetch workflow/learning from SiteConfig (still JSON)
      const configEntries = await prisma.siteConfig.findMany({
        where: {
          key: {
            in: ['uses_workflow', 'uses_learning'],
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
        hardware, // ✅ From Hardware table
        software, // ✅ From Software table
        workflow: configMap.uses_workflow || [],
        learning: configMap.uses_learning || [],
      };
    },
    USES_CACHE_TTL
  );
}