// app/(public)/about/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { prisma } from '@/lib/prisma';
import { cachedQuery } from '@/lib/cache'; // ✅ Import cache utilities
import { AboutHero } from '@/components/features/about/AboutHero';
import { AboutBio } from '@/components/features/about/AboutBio';
import { ExperienceTimeline } from '@/components/features/about/ExperienceTimeline';
import { SkillsVisualization } from '@/components/features/about/SkillsVisualization';
import { EducationSection } from '@/components/features/about/EducationSection';
import { PersonalInterests } from '@/components/features/about/PersonalInterests';
import { ResumeDownload } from '@/components/features/about/ResumeDownload';
import { AboutSkeleton } from '@/components/features/about/AboutSkeleton'; // ✅ Create this skeleton

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about my journey, experience, and what drives me as a Full-stack Web Developer & UI/UX Developer.',
  openGraph: {
    title: `About | ${siteConfig.name}`,
    description: 'Learn more about my journey and experience.',
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `About | ${siteConfig.name}`,
    description: 'Learn more about my journey and experience.',
    images: [siteConfig.ogImage],
  },
};
export const revalidate = 3600; // 24 hours

// ============================================================================
// CACHED DATA FETCHING FUNCTIONS
// ============================================================================

// ✅ Cache keys for in-memory caching
const ABOUT_CACHE_KEYS = {
  SKILLS: 'about:skills',
  EXPERIENCE: 'about:experience',
  SITE_CONFIG: 'about:siteConfig',
} as const;

// ✅ Cache TTLs (About page data rarely changes)
const SKILLS_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const EXPERIENCE_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const CONFIG_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days (site config changes rarely)

// ✅ Fetch skills with caching and selective fields
async function getSkills() {
  return cachedQuery(
    ABOUT_CACHE_KEYS.SKILLS,
    async () => {
      console.log('🔍 Fetching skills from database...');
      
      // ✅ OPTIMIZATION: Select only needed fields
      const skills = await prisma.skill.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          icon: true,
          proficiency: true,
          order: true,
        },
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      });

      // ✅ Group skills by category for SkillsVisualization
      const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {} as Record<string, typeof skills>);

      console.log(`✅ Fetched ${skills.length} skills in ${skillsByCategory ? Object.keys(skillsByCategory).length : 0} categories`);
      
      return { skills, skillsByCategory };
    },
    SKILLS_CACHE_TTL
  );
}

// ✅ Fetch experience with caching and selective fields
async function getExperience() {
  return cachedQuery(
    ABOUT_CACHE_KEYS.EXPERIENCE,
    async () => {
      console.log('🔍 Fetching experience from database...');
      
      // ✅ OPTIMIZATION: Select only needed fields
      const experience = await prisma.experience.findMany({
        select: {
          id: true,
          company: true,
          role: true,
          location: true,
          startDate: true,
          endDate: true,
          isCurrent: true,
          description: true,
          highlights: true,
          technologies: true,
          order: true,
        },
        orderBy: [{ order: 'asc' }],
      });

      console.log(`✅ Fetched ${experience.length} experience entries`);
      return experience;
    },
    EXPERIENCE_CACHE_TTL
  );
}

// ✅ Fetch site config with caching
async function getSiteConfig() {
  return cachedQuery(
    ABOUT_CACHE_KEYS.SITE_CONFIG,
    async () => {
      console.log('🔍 Fetching site config from database...');
      
      const config = await prisma.siteConfig.findMany({
        select: {
          key: true,
          value: true,
        },
      });

      const configMap = Object.fromEntries(
        config.map((c) => [c.key, c.value])
      );

      console.log(`✅ Fetched ${Object.keys(configMap).length} config entries`);
      return configMap;
    },
    CONFIG_CACHE_TTL
  );
}

// ✅ Fetch all about data in parallel
async function getAboutData() {
  const startTime = Date.now();
  console.log('🚀 Fetching about page data...');

  try {
    // ✅ OPTIMIZATION: Fetch all data in parallel
    const [skillsData, experience, siteConfig] = await Promise.all([
      getSkills(),
      getExperience(),
      getSiteConfig(),
    ]);

    const fetchTime = Date.now() - startTime;
    console.log(`✅ About data fetched in ${fetchTime}ms`);

    return {
      ...skillsData,
      experience,
      siteConfig,
    };
  } catch (error) {
    console.error('❌ Error fetching about ', error);
    return { 
      skills: [], 
      skillsByCategory: {}, 
      experience: [], 
      siteConfig: {} 
    };
  }
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function AboutPage() {
  console.log('🎨 Rendering about page...');

  // ✅ Fetch all data (cached, so subsequent loads are instant)
  const data = await getAboutData();


  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-5xl mx-auto space-y-20">
        {/* Hero Section - Always rendered immediately */}
        <AboutHero />

        {/* Bio Section - Always rendered immediately */}
        <AboutBio />

        {/* Experience Timeline - Streamed with Suspense */}
        <Suspense fallback={<AboutSkeleton section="experience" />}>
          <ExperienceTimeline experience={data.experience} />
        </Suspense>

        {/* Skills Visualization - Streamed with Suspense */}
        <Suspense fallback={<AboutSkeleton section="skills" />}>
          <SkillsVisualization skillsByCategory={data.skillsByCategory} />
        </Suspense>

        {/* Education & Certifications - Always rendered immediately */}
        <EducationSection />

        {/* Personal Interests - Always rendered immediately */}
        <PersonalInterests />

        {/* Resume Download CTA - Always rendered immediately */}
        <ResumeDownload />
      </div>
    </div>
  );
}

// ============================================================================
// NEXT.JS OPTIMIZATIONS
// ============================================================================

// ✅ OPTIMIZATION: Enable ISR (About page rarely changes)

// ✅ OPTIMIZATION: Pre-render the about page at build time
