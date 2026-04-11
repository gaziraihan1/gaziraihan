import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { prisma } from '@/lib/prisma';
import { cachedQuery } from '@/lib/cache'; // ✅ Import cache utilities
import { Button } from '@/components/ui/button';
import { TableOfContents } from '@/components/features/blog/TableOfContents';
import { BlogPost } from '@/components/features/blog/BlogPost';
import { ReadingProgress } from '@/components/features/blog/ReadingProgress';
import { RelatedPosts } from '@/components/features/blog/RelatedPost';

export const revalidate = 3600; // 1 
interface BlogPageProps {
  params: Promise<{ slug: string }>;
}


export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const post = await cachedQuery(
    `blog:meta:${slug}`,
    async () => {
      return prisma.blogPost.findUnique({
        where: { slug, published: true },
        select: {
          title: true,
          slug: true,
          excerpt: true,
          thumbnail: true,
          publishedAt: true,
          tags: { select: { name: true } },
          author: { select: { name: true } },
        },
      });
    },
    60 * 60 * 1000 // 1 hour cache for metadata
  );
  

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | ${siteConfig.name}`,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      siteName: siteConfig.name,
      images: post.thumbnail ? [post.thumbnail] : [siteConfig.ogImage],
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author?.name ? [post.author.name] : [siteConfig.name],
      tags: post.tags.map((t) => t.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | ${siteConfig.name}`,
      description: post.excerpt,
      images: post.thumbnail ? [post.thumbnail] : [siteConfig.ogImage],
    },
  };
}
export async function generateStaticParams() {
  console.log('🔧 Generating static params for blog posts...');
  
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
      orderBy: { publishedAt: 'desc' },
      take: 50, // Limit to most recent 50 posts for build time
    });

    console.log(`✅ Pre-rendering ${posts.length} blog posts`);
    
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('❌ Error generating static params:', error);
    return []; // Fallback: dynamic rendering
  }
}


const getBlogPostCacheKey = (slug: string) => `blog:post:${slug}`;
const BLOG_POST_CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getPostData(slug: string) {
  return cachedQuery(
    getBlogPostCacheKey(slug),
    async () => {
      console.log(`🔍 Fetching blog post "${slug}" from database...`);
      const fetchStart = Date.now();
      
      const post = await prisma.blogPost.findUnique({
        where: { slug, published: true },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true, // ✅ Full content needed for detail view
          thumbnail: true,
          publishedAt: true,
          updatedAt: true,
          views: true,
          tags: {
            select: { id: true, name: true, slug: true, color: true },
          },
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!post) {
        console.log(`⚠️ Post not found: ${slug}`);
        return null;
      }

      const relatedPostsPromise = prisma.blogPost.findMany({
        where: {
          slug: { not: slug },
          published: true,
          tags: {
            some: {
              id: { in: post.tags.map((t) => t.id) },
            },
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          thumbnail: true,
          publishedAt: true,
          tags: { select: { id: true, name: true, slug: true } },
        },
        take: 3,
        orderBy: { publishedAt: 'desc' },
      });

      prisma.blogPost.update({
        where: { id: post.id },
         data:{ views: { increment: 1 } },
      }).catch((err) => {
        console.error(`⚠️ Failed to increment view count for ${slug}:`, err);
      });

      let relatedPosts: any[] = [];
      try {
        relatedPosts = await relatedPostsPromise;
      } catch (error) {
        console.error(`⚠️ Failed to fetch related posts for ${slug}:`, error);
      }

      const fetchTime = Date.now() - fetchStart;
      console.log(`✅ Fetched post "${slug}" in ${fetchTime}ms`);

      return { post, relatedPosts };
    },
    BLOG_POST_CACHE_TTL
  );
}


function generateSchema(post: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.thumbnail,
    url: `${siteConfig.url}/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author?.name || siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: siteConfig.ogImage,
      },
    },
    keywords: post.tags.map((t: any) => t.name).join(', '),
    wordCount: post.content?.split(' ').length || 0,
    inLanguage: 'en-US',
  };
}


export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  
  console.log(`🎨 Rendering blog post: ${slug}`);

  const data = await getPostData(slug);

  if (!data || !data.post) {
    console.log(`❌ Post not found: ${slug}`);
    notFound();
  }

  const { post, relatedPosts } = data;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSchema(post)) }}
      />

      <ReadingProgress />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <article className="lg:col-span-8">
            <BlogPost post={post} />
          </article>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <TableOfContents content={post.content} />

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">About the Author</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-indigo-400">
                      {post.author?.name?.[0]?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">
                      {post.author?.name || siteConfig.name}
                    </p>
                    <p className="text-sm text-gray-500">Front-end Developer</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Share this article</h3>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 min-w-0"
                    asChild
                  >
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${siteConfig.url}/blog/${post.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Twitter
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 min-w-0"
                    asChild
                  >
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteConfig.url}/blog/${post.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/10">
            <RelatedPosts posts={relatedPosts} />
          </div>
        )}
      </div>
    </>
  );
}
