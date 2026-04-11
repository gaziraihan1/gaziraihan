import { Suspense } from "react";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { cachedQuery } from "@/lib/cache";
import { cache } from "@/lib/cache";
import { BentoGridSkeleton } from "@/components/features/home/BentoGridSkeleton";
import { HeroCard } from "@/components/features/home/HeroCard";
import { TechStackCard } from "@/components/features/home/TechStatCard";
import {
  GitHubStatsCard,
  type GitHubStats,
} from "@/components/features/home/GithubStatsCard";
import { FeaturedProjectsCard } from "@/components/features/home/FeaturedProjectCard";
import { ExperienceCard } from "@/components/features/home/ExperienedCard";
import { BlogPreviewCard } from "@/components/features/home/BlogPreviewCard";
import { ContactCard } from "@/components/features/home/ContactCard";
import { TechSkill } from "@/types/skills";

export const revalidate = 3600; // 1 hour ISR


export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};


const HOME_CACHE_KEYS = {
  SKILLS:     "home:skills",
  PROJECTS:   "home:projects",
  EXPERIENCE: "home:experience",
  BLOG:       "home:blog",
  GITHUB:     "home:github",
} as const;

const TTL = {
  SKILLS:     24 * 60 * 60 * 1000,      // 24 hours
  PROJECTS:   60 * 60 * 1000,           // 1 hour
  EXPERIENCE: 7 * 24 * 60 * 60 * 1000, // 7 days
  BLOG:       60 * 60 * 1000,           // 1 hour
  GITHUB:     30 * 60 * 1000,           // 30 minutes
} as const;

const FALLBACK_GITHUB_STATS: GitHubStats = {
  followers: 0,
  publicRepos: 0,
  totalStars: 0,
  topRepos: [],
};


async function getHomeSkills() {
  return cachedQuery(
    HOME_CACHE_KEYS.SKILLS,
    async () => {
      const skills = await prisma.skill.findMany({
        select: { id: true, name: true, category: true, icon: true, proficiency: true, order: true },
        where: { order: { gt: -1 } },
        orderBy: { order: "asc" },
        take: 12,
      });
      return skills as TechSkill[];
    },
    TTL.SKILLS,
  );
}

async function getHomeProjects() {
  return cachedQuery(
    HOME_CACHE_KEYS.PROJECTS,
    async () =>
      prisma.project.findMany({
        select: {
          id: true, title: true, slug: true, summary: true,
          thumbnail: true, featured: true, status: true, order: true,
          tags:    { select: { id: true, name: true, slug: true, color: true } },
          metrics: { select: { id: true, label: true, value: true } },
        },
        where: { featured: true, status: "LIVE" },
        orderBy: { order: "asc" },
        take: 3,
      }),
    TTL.PROJECTS,
  );
}

async function getHomeExperience() {
  return cachedQuery(
    HOME_CACHE_KEYS.EXPERIENCE,
    async () =>
      prisma.experience.findMany({
        select: {
          id: true, company: true, role: true, location: true,
          startDate: true, endDate: true, isCurrent: true,
          description: true, highlights: true, technologies: true, order: true,
        },
        where: { order: { gt: -1 } },
        orderBy: { order: "asc" },
        take: 4,
      }),
    TTL.EXPERIENCE,
  );
}

async function getHomeBlogPosts() {
  return cachedQuery(
    HOME_CACHE_KEYS.BLOG,
    async () =>
      prisma.blogPost.findMany({
        select: {
          id: true, title: true, slug: true, excerpt: true,
          thumbnail: true, publishedAt: true,
          tags: { select: { id: true, name: true, slug: true, color: true } },
        },
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 2,
      }),
    TTL.BLOG,
  );
}

async function getGitHubStats(): Promise<GitHubStats> {
  const cached = cache.get<GitHubStats>(HOME_CACHE_KEYS.GITHUB);
  if (cached) return cached;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/github-stats`, {
      next: { revalidate: TTL.GITHUB / 1000 },
    });

    if (!res.ok) throw new Error(`GitHub stats API returned ${res.status}`);

    return (await res.json()) as GitHubStats;
  } catch (error) {
    console.error("❌ Failed to fetch GitHub stats for home page:", error);
    return FALLBACK_GITHUB_STATS;
  }
}

async function getHomeData() {
  const [skills, projects, experience, blogPosts, githubStats] =
    await Promise.allSettled([
      getHomeSkills(),
      getHomeProjects(),
      getHomeExperience(),
      getHomeBlogPosts(),
      getGitHubStats(),
    ]);

  return {
    skills:      skills.status      === "fulfilled" ? skills.value      : [],
    projects:    projects.status    === "fulfilled" ? projects.value    : [],
    experience:  experience.status  === "fulfilled" ? experience.value  : [],
    blogPosts:   blogPosts.status   === "fulfilled" ? blogPosts.value   : [],
    githubStats: githubStats.status === "fulfilled" ? githubStats.value : FALLBACK_GITHUB_STATS,
  };
}


export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="container mx-auto px-4 md:px-8 xl:px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">

        <HeroCard />

        <Suspense fallback={<BentoGridSkeleton className="md:col-span-1 md:row-span-1" />}>
          <TechStackCard skills={data.skills} />
        </Suspense>

        <Suspense fallback={<BentoGridSkeleton className="md:col-span-1 md:row-span-1" />}>
          <GitHubStatsCard initialStats={data.githubStats} />
        </Suspense>

        <Suspense fallback={<BentoGridSkeleton className="md:col-span-2 md:row-span-1" />}>
          <FeaturedProjectsCard projects={data.projects} />
        </Suspense>

        <Suspense fallback={<BentoGridSkeleton className="md:col-span-1 md:row-span-2" />}>
          <ExperienceCard experience={data.experience} />
        </Suspense>

        <Suspense fallback={<BentoGridSkeleton className="md:col-span-1 md:row-span-1" />}>
          <BlogPreviewCard posts={data.blogPosts} />
        </Suspense>

        <Suspense fallback={<BentoGridSkeleton className="md:col-span-1 md:row-span-1" />}>
          <ContactCard />
        </Suspense>

      </div>
    </div>
  );
}