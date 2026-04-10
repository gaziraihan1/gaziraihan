// app/(public)/projects/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { prisma } from '@/lib/prisma';
import { cachedQuery } from '@/lib/cache'; // ✅ Import cache utilities
import { ProjectsHeader } from '@/components/features/projects/ProjectsHeader';
import { ProjectFilters } from '@/components/features/projects/ProjectFilters';
import { EmptyState } from '@/components/ui/emptyState';
import { ProjectGrid } from '@/components/features/projects/ProjectGrid';
import { ProjectPagination } from '@/components/features/projects/ProjectPagination';
import { ProjectsSkeleton } from '@/components/features/projects/ProjectsSkeleton';
import { ProjectTag } from '@/types/project';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my portfolio of web applications, UI/UX designs, and full-stack projects built with modern technologies.',
  openGraph: {
    title: `Projects | ${siteConfig.name}`,
    description: 'Explore my portfolio of web applications and full-stack projects.',
    url: `${siteConfig.url}/projects`,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Projects | ${siteConfig.name}`,
    description: 'Explore my portfolio of web applications and full-stack projects.',
    images: [siteConfig.ogImage],
  },
};

export const revalidate = 3600; // 1 hour

// ✅ OPTIMIZATION 1: Cache filter options with in-memory cache
const FILTER_CACHE_KEY = 'projects:filters';
const FILTER_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getFilterOptions() {
  return cachedQuery(
    FILTER_CACHE_KEY,
    async () => {
      console.log('🔍 Fetching project filter options from database...');
      
      const [tags, categories] = await Promise.all([
        prisma.tag.findMany({
          select: { id: true, name: true, slug: true, color: true },
          orderBy: { name: 'asc' },
        }),
        prisma.skill.groupBy({
          by: ['category'],
          _count: { category: true },
          orderBy: { _count: { category: 'desc' } },
        }),
      ]);

      return {
        tags: tags as ProjectTag[],
        categories: categories.map((c) => c.category),
      };
    },
    FILTER_CACHE_TTL
  );
}

// ✅ OPTIMIZATION 2: Cache projects with in-memory cache
const PROJECTS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getProjects({
  page = 1,
  limit = 9,
  search,
  tag,
  category,
}: {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  category?: string;
}) {
  const totalStart = Date.now()
  // ✅ Create unique cache key based on query params
  const cacheKey = `projects:page=${page}:limit=${limit}:search=${search || ''}:tag=${tag || ''}:category=${category || ''}`;
  
  return cachedQuery(
    cacheKey,
    async () => {
      console.log(`🔍 Fetching projects from database (page ${page})...`);
      const queryStart = Date.now();
      
      const skip = (page - 1) * limit;

      // ✅ Build efficient where clause
      const where: any = {
        status: 'LIVE',
      };

      if (search) {
        // ✅ Only search title and summary (not full description)
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (tag) {
        where.tags = {
          some: { slug: tag },
        };
      }

      // ✅ FIXED: Add category filter if provided
      if (category) {
        where.skills = {
          some: { category },
        };
      }

      // ✅ OPTIMIZATION 3: Select only needed fields (prevents N+1)
      const projectSelect = {
        id: true,
        title: true,
        slug: true,
        summary: true,
        thumbnail: true,
        status: true,
        featured: true,
        createdAt: true,
        // ✅ Only fetch tags that are actually used in UI
        tags: {
          select: { id: true, name: true, slug: true, color: true },
        },
        // ✅ FIXED: Only fetch metrics if you actually display them in ProjectGrid
        // If ProjectGrid doesn't use metrics, REMOVE this to save query time
        metrics: {
          select: { id: true, label: true, value: true },
        },
      };

      // ✅ OPTIMIZATION 4: Fetch projects and count in parallel
      const [projects, totalCount] = await Promise.all([
        prisma.project.findMany({
          where,
          select: projectSelect,
          skip,
          take: limit,
          orderBy: { order: 'asc' },
        }),
        prisma.project.count({ where }),
      ]);

      const queryTime = Date.now() - queryStart;
      console.log(`✅ Fetched ${projects.length} projects in ${queryTime}ms (total: ${totalCount})`);
        console.log(`⏱️ Total getProjects: ${Date.now() - totalStart}ms`);


      return {
        projects,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalProjects: totalCount,
          hasNextPage: skip + limit < totalCount,
          hasPrevPage: page > 1,
        },
      };
    },
    PROJECTS_CACHE_TTL
  );
}

interface ProjectsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    tag?: string;
    category?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  
  console.log(`🚀 Rendering projects page (page ${page}, search: ${params.search}, tag: ${params.tag}, category: ${params.category})`);

  // ✅ OPTIMIZATION 5: Fetch filters and projects in parallel
  const [filterOptions, { projects, pagination }] = await Promise.all([
    getFilterOptions(),
    getProjects({
      page,
      search: params.search,
      tag: params.tag,
      category: params.category,
    }),
  ]);


  // ✅ OPTIMIZATION 6: Use stable key for Suspense (avoid JSON.stringify)
  const suspenseKey = `page=${page}:tag=${params.tag || ''}:search=${params.search || ''}`;

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Header */}
      <ProjectsHeader totalProjects={pagination.totalProjects} />

      {/* Filters */}
      <ProjectFilters
        tags={filterOptions.tags}
        categories={filterOptions.categories}
        currentTag={params.tag}
        currentCategory={params.category}
        currentSearch={params.search}
      />

      {/* Project Grid - Streaming with Suspense */}
      <Suspense key={suspenseKey} fallback={<ProjectsSkeleton />}>
        {projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="Try adjusting your filters or search terms."
            action={{
              label: 'Clear Filters',
              href: '/projects',
            }}
          />
        ) : (
          <>
            <ProjectGrid projects={projects} />
            {pagination.totalPages > 1 && (
              <ProjectPagination pagination={pagination} currentParams={params} />
            )}
          </>
        )}
      </Suspense>
    </div>
  );
}
