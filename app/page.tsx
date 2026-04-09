// app/(public)/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { prisma } from '@/lib/prisma';
import { cachedQuery } from '@/lib/cache'; // ✅ Import cache utilities
import { BentoGridSkeleton } from '@/components/features/home/BentoGridSkeleton';
import { HeroCard } from '@/components/features/home/HeroCard';
import { TechStackCard } from '@/components/features/home/TechStatCard';
import { GitHubStatsCard, type GitHubStats } from '@/components/features/home/GithubStatsCard'; // ✅ Import type
import { FeaturedProjectsCard } from '@/components/features/home/FeaturedProjectCard';
import { ExperienceCard } from '@/components/features/home/ExperienedCard';
import { BlogPreviewCard } from '@/components/features/home/BlogPreviewCard';
import { ContactCard } from '@/components/features/home/ContactCard';

export const meta: Metadata = {
  title: 'Home',
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

// ============================================================================
// CACHED DATA FETCHING FUNCTIONS
// ============================================================================

// ✅ Cache keys for home page data
const HOME_CACHE_KEYS = {
  SKILLS: 'home:skills',
  PROJECTS: 'home:projects',
  EXPERIENCE: 'home:experience',
  BLOG: 'home:blog',
  GITHUB: 'home:github', // ✅ External API cache
} as const;

// ✅ Cache TTLs (home page data rarely changes)
const SKILLS_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const PROJECTS_CACHE_TTL = 60 * 60 * 1000; // 1 hour
const EXPERIENCE_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
const BLOG_CACHE_TTL = 60 * 60 * 1000; // 1 hour
const GITHUB_CACHE_TTL = 30 * 60 * 1000; // 30 minutes (external API rate limits)

// ✅ Fetch skills with caching and selective fields
async function getHomeSkills() {
  return cachedQuery(
    HOME_CACHE_KEYS.SKILLS,
    async () => {
      console.log('🔍 Fetching home skills from database...');
      
      const skills = await prisma.skill.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          icon: true,
          proficiency: true,
        },
        where: { order: { gt: -1 } },
        orderBy: { order: 'asc' },
        take: 12,
      });

      console.log(`✅ Fetched ${skills.length} skills for home page`);
      return skills;
    },
    SKILLS_CACHE_TTL
  );
}

// ✅ Fetch featured projects with caching and selective fields
async function getHomeProjects() {
  return cachedQuery(
    HOME_CACHE_KEYS.PROJECTS,
    async () => {
      console.log('🔍 Fetching featured projects from database...');
      
      const projects = await prisma.project.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          thumbnail: true,
          featured: true,
          status: true,
          order: true,
          tags: {
            select: { id: true, name: true, slug: true, color: true },
          },
          metrics: {
            select: { id: true, label: true, value: true },
          },
        },
        where: { featured: true, status: 'LIVE' },
        orderBy: { order: 'asc' },
        take: 3,
      });

      console.log(`✅ Fetched ${projects.length} featured projects for home page`);
      return projects;
    },
    PROJECTS_CACHE_TTL
  );
}

// ✅ Fetch experience with caching and selective fields
async function getHomeExperience() {
  return cachedQuery(
    HOME_CACHE_KEYS.EXPERIENCE,
    async () => {
      console.log('🔍 Fetching home experience from database...');
      
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
        where: { order: { gt: -1 } },
        orderBy: { order: 'asc' },
        take: 4,
      });

      console.log(`✅ Fetched ${experience.length} experience entries for home page`);
      return experience;
    },
    EXPERIENCE_CACHE_TTL
  );
}

// ✅ Fetch blog posts with caching and selective fields
async function getHomeBlogPosts() {
  return cachedQuery(
    HOME_CACHE_KEYS.BLOG,
    async () => {
      console.log('🔍 Fetching home blog posts from database...');
      
      const blogPosts = await prisma.blogPost.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          thumbnail: true,
          publishedAt: true,
          tags: {
            select: { id: true, name: true, slug: true, color: true },
          },
        },
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        take: 2,
      });

      console.log(`✅ Fetched ${blogPosts.length} blog posts for home page`);
      return blogPosts;
    },
    BLOG_CACHE_TTL
  );
}

// ✅ ✅ ✅ MISSING FUNCTION: Fetch GitHub stats with caching (external API)
async function getGitHubStats(): Promise<GitHubStats> {
  return cachedQuery(
    HOME_CACHE_KEYS.GITHUB,
    async () => {
      console.log('🔍 Fetching GitHub stats from API...');
      const fetchStart = Date.now();
      
      try {
        // ✅ Get username from env var or fallback
        const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'yourusername';
        
        // ✅ Use AbortController for timeout protection
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        // ✅ Fetch user data and repos in parallel
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              // ✅ Add GitHub token if available (higher rate limits)
              ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
                'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              }),
            },
          }),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
                'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              }),
            },
          }),
        ]);
        
        clearTimeout(timeoutId);
        
        // ✅ Handle API errors gracefully
        if (!userRes.ok || !reposRes.ok) {
          console.warn('⚠️ GitHub API request failed, using fallback data');
          return {
            followers: 0,
            publicRepos: 0,
            totalStars: 0,
            topRepos: [],
          };
        }
        
        const userData = await userRes.json();
        const reposData = await reposRes.json();
        
        // ✅ Safe reduce with null checks
        const totalStars = reposData?.reduce?.(
          (acc: number, repo: any) => acc + (repo?.stargazers_count || 0), 
          0
        ) || 0;
        
        const stats: GitHubStats = {
          followers: Number(userData?.followers) || 0,
          publicRepos: Number(userData?.public_repos) || 0,
          totalStars,
          // ✅ Include top repos for display
          topRepos: reposData?.slice?.(0, 3)?.map((repo: any) => ({
            name: repo?.name || 'Unknown',
            description: repo?.description,
            stars: repo?.stargazers_count || 0,
            language: repo?.language,
            url: repo?.html_url || '#',
          })) || [],
        };
        
        const fetchTime = Date.now() - fetchStart;
        console.log(`✅ Fetched GitHub stats in ${fetchTime}ms`);
        
        return stats;
        
      } catch (error) {
        console.error('❌ Error fetching GitHub stats:', error);
        // ✅ Return fallback data so page still renders
        return {
          followers: 0,
          publicRepos: 0,
          totalStars: 0,
          topRepos: [],
        };
      }
    },
    GITHUB_CACHE_TTL
  );
}

// ✅ Fetch all home data in parallel
async function getHomeData() {
  const startTime = Date.now();
  console.log('🚀 Fetching home page data...');

  try {
    // ✅ OPTIMIZATION: Fetch ALL data in parallel (including external GitHub API)
    const [skills, projects, experience, blogPosts, githubStats] = await Promise.all([
      getHomeSkills(),
      getHomeProjects(),
      getHomeExperience(),
      getHomeBlogPosts(),
      getGitHubStats(), // ✅ Now this function exists!
    ]);

    const fetchTime = Date.now() - startTime;
    console.log(`✅ Home data fetched in ${fetchTime}ms`);

    return {
      skills,
      projects,
      experience,
      blogPosts,
      githubStats,
    };
  } catch (error) {
    console.error('❌ Error fetching home ', error);
    return { 
      skills: [], 
      projects: [], 
      experience: [], 
      blogPosts: [],
      githubStats: { followers: 0, publicRepos: 0, totalStars: 0, topRepos: [] },
    };
  }
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function HomePage() {
  console.log('🎨 Rendering home page...');

  // ✅ Fetch all data (cached, so subsequent loads are instant)
  const data = await getHomeData();

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* ✅ HeroCard - NO Suspense, load immediately (above-fold, critical) */}
        <HeroCard />

        {/* Tech Stack Card - Streamed with Suspense */}
        <Suspense fallback={<BentoGridSkeleton className="md:col-span-1 md:row-span-1" />}>
          <TechStackCard skills={data.skills} />
        </Suspense>

        {/* GitHub Stats Card - Streamed with Suspense (external API) */}
        <Suspense fallback={<BentoGridSkeleton className="md:col-span-1 md:row-span-1" />}>
          {/* ✅ Pass cached githubStats from server */}
          <GitHubStatsCard githubStats={data.githubStats} />
        </Suspense>

        {/* Featured Projects Card - Streamed with Suspense */}
        <Suspense fallback={<BentoGridSkeleton className="md:col-span-2 md:row-span-1" />}>
          <FeaturedProjectsCard projects={data.projects} />
        </Suspense>

        {/* Experience Card - Streamed with Suspense */}
        <Suspense fallback={<BentoGridSkeleton className="md:col-span-1 md:row-span-2" />}>
          <ExperienceCard experience={data.experience} />
        </Suspense>

        {/* Blog Preview Card - Streamed with Suspense */}
        <Suspense fallback={<BentoGridSkeleton className="md:col-span-1 md:row-span-1" />}>
          <BlogPreviewCard posts={data.blogPosts} />
        </Suspense>

        {/* Contact Card - Streamed with Suspense */}
        <Suspense fallback={<BentoGridSkeleton className="md:col-span-1 md:row-span-1" />}>
          <ContactCard />
        </Suspense>

      </div>
    </div>
  );
}

// ============================================================================
// NEXT.JS OPTIMIZATIONS
// ============================================================================

// ✅ OPTIMIZATION: Enable ISR (home page rarely changes)
export const revalidate = 60 * 60; // 1 hour

// ✅ OPTIMIZATION: Pre-render home page at build time (it's static!)
export const dynamic = 'force-static';

// ✅ OPTIMIZATION: Generate static params (for SSG)
export async function generateStaticParams() {
  // Home page has no dynamic params, but this ensures it's pre-rendered
  return [{}];
}