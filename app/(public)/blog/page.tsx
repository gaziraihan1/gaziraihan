import { Suspense } from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { prisma } from '@/lib/prisma';
import { cachedQuery } from '@/lib/cache';
import { BlogHeader } from '@/components/features/blog/BlogHeader';
import { BlogGrid } from '@/components/features/blog/BlogGrid';
import { EmptyState } from '@/components/ui/emptyState';
import { BlogPagination } from '@/components/features/blog/BlogPagination';
import { BlogFilters } from '@/components/features/blog/BlogFilters';
import { BlogSkeleton } from '@/components/features/blog/BlogSkeleton';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles, tutorials, and insights on web development, UI/UX design, and Web Development.',
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description: 'Technical articles and insights on web development.',
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog | ${siteConfig.name}`,
    description: 'Technical articles and insights on web development.',
    images: [siteConfig.ogImage],
  },
};
export const revalidate = 3600; // 1 hour


const FILTER_CACHE_KEY = 'blog:filters';
const FILTER_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getFilterOptions() {
  return cachedQuery(
    FILTER_CACHE_KEY,
    async () => {
      console.log('🔍 Fetching filter options from database...');
      
      const tags = await prisma.tag.findMany({
        select: { 
          id: true, 
          name: true, 
          slug: true, 
          color: true 
        },
        orderBy: { name: 'asc' },
      });

      return { tags };
    },
    FILTER_CACHE_TTL
  );
}

const BLOG_CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getBlogPosts({
  page = 1,
  limit = 9,
  search,
  tag,
}: {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
}) {
  const queryStart = Date.now()
  const cacheKey = `blog:posts:page=${page}:limit=${limit}:search=${search || ''}:tag=${tag || ''}`;
  
  return cachedQuery(
    cacheKey,
    async () => {
      console.log(`🔍 Fetching blog posts from database (page ${page})...`);
      
      const skip = (page - 1) * limit;

      const where: any = {
        published: true,
      };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (tag) {
        where.tags = {
          some: { slug: tag },
        };
      }

      const postSelect = {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnail: true,
        publishedAt: true,
        views: true,
        tags: {
          select: { id: true, name: true, slug: true, color: true },
        },
        author: {
          select: { name: true, email: true },
        },
      };

      const [posts, totalCount] = await Promise.all([
        prisma.blogPost.findMany({
          where,
          select: postSelect,
          skip,
          take: limit,
          orderBy: { publishedAt: 'desc' },
        }),
        prisma.blogPost.count({ where }),
      ]);

      console.log(`✅ Fetched ${posts.length} posts, total: ${totalCount}`);
      const queryEnd = Date.now();
      console.log(`Database query took ${queryEnd - queryStart}ms`)

      return {
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalPosts: totalCount,
          hasNextPage: skip + limit < totalCount,
          hasPrevPage: page > 1,
        },
      };
    },
    BLOG_CACHE_TTL
  );
}

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    tag?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  
  console.log(`🚀 Rendering blog page (page ${page}, search: ${params.search}, tag: ${params.tag})`);

  const [filterOptions, { posts, pagination }] = await Promise.all([
    getFilterOptions(),
    getBlogPosts({
      page,
      search: params.search,
      tag: params.tag,
    }),
  ]);


  return (
    <div className="container mx-auto px-4 py-20">
      <BlogHeader totalPosts={pagination.totalPosts} />

      <BlogFilters
        tags={filterOptions.tags}
        currentTag={params.tag}
        currentSearch={params.search}
      />

      <Suspense key={JSON.stringify(params)} fallback={<BlogSkeleton />}>
        {posts.length === 0 ? (
          <EmptyState
            title="No posts found"
            description="Try adjusting your filters or check back later for new content."
            action={{
              label: 'Clear Filters',
              href: '/blog',
            }}
          />
        ) : (
          <>
            <BlogGrid posts={posts} />
            {pagination.totalPages > 1 && (
              <BlogPagination pagination={pagination} currentParams={params} />
            )}
          </>
        )}
      </Suspense>

      <NewsletterSignup />
    </div>
  );
}

function NewsletterSignup() {
  return (
    <div className="mt-20 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Subscribe to My Newsletter
      </h2>
      <p className="text-gray-400 mb-6 max-w-xl mx-auto">
        Get notified when I publish new articles. No spam, unsubscribe anytime.
      </p>
      <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}