'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache'; // ✅ Added revalidateTag
import { z, ZodError } from 'zod'; // ✅ Added ZodError for better error handling
import { cache } from '@/lib/cache';

export type CreateBlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string | null;
  published: boolean;
  tags: string[];
};

const blogPostSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters'),
  slug: z.string()
    .min(5, 'Slug must be at least 5 characters')
    .max(200, 'Slug must be less than 200 characters'),
  excerpt: z.string()
    .min(20, 'Excerpt must be at least 20 characters')
    .max(500, 'Excerpt must be less than 500 characters'),
  content: z.string()
    .min(100, 'Content must be at least 100 characters'),
  thumbnail: z.string()
    .url('Thumbnail must be a valid URL')
    .optional()
    .or(z.literal('')),
  published: z.boolean(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')),
});
export async function invalidateHomeCache() {
  cache.delete('home:blog');
  revalidatePath('/');
  revalidatePath('/blog');
  console.log('✅ Home blog cache invalidated');
}

export async function invalidateBlogPostCache(postSlug?: string) {
  console.log(`🔄 Invalidating cache for blog post: ${postSlug || 'all'}`);
  
  if (postSlug) {
    cache.delete(`blog:post:${postSlug}`);
    cache.delete(`blog:meta:${postSlug}`);
  } else {
    cache.clear();
  }
  
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  revalidatePath('/');
  
  if (postSlug) {
    revalidatePath(`/blog/${postSlug}`);
  }
  
  console.log(`✅ Blog cache invalidated`);
}

function formatZodError(error: ZodError): string {
  return error.issues
    .map(issue => {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'field';
      return `${path}: ${issue.message}`;
    })
    .join(', ');
}


export async function createBlogPost(rawData: CreateBlogPostInput) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    console.warn('⚠️ Unauthorized blog post creation attempt');
    return { success: false, error: 'Unauthorized' }; // ✅ Consistent: return, don't throw
  }

  const startTime = Date.now();
  console.log('📝 Creating blog post...');

  try {
    const data = blogPostSchema.parse(rawData);
    console.log('✅ Input validated');

    const post = await prisma.blogPost.create({
       data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        thumbnail: data.thumbnail || null,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
        tags: {
          connect: data.tags.map((slug) => ({ slug })),
        },
        author: {
          connect: { email: session.user.email! },
        },
      },
    });

    const createTime = Date.now() - startTime;
    console.log(`✅ Blog post created in ${createTime}ms: ${post.slug}`);

    await invalidateBlogPostCache(post.slug);
    await invalidateHomeCache()
    
    return { success: true, post };
    
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Error creating blog post after ${errorTime}ms:`, error);
    
    if (error instanceof ZodError) {
      return { success: false, error: formatZodError(error) };
    }
    
    return { success: false, error: 'Failed to create blog post' };
  }
}


export async function updateBlogPost(id: string, rawData: CreateBlogPostInput) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    console.warn('⚠️ Unauthorized blog post update attempt');
    return { success: false, error: 'Unauthorized' };
  }

  const startTime = Date.now();
  console.log(`✏️ Updating blog post ${id}...`);

  try {
    const data = blogPostSchema.parse(rawData);
    console.log('✅ Input validated');

    const currentPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { slug: true },
    });
    console.log('✅ Current post fetched');

    const post = await prisma.blogPost.update({
      where: { id },
       data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        thumbnail: data.thumbnail || null,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
        tags: {
          set: data.tags.map((slug) => ({ slug })),
        },
      },
    });

    const updateTime = Date.now() - startTime;
    console.log(`✅ Blog post updated in ${updateTime}ms: ${post.slug}`);

    await invalidateBlogPostCache(currentPost?.slug);
    await invalidateBlogPostCache(post.slug);
    await invalidateHomeCache()
    
    return { success: true, post };
    
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Error updating blog post ${id} after ${errorTime}ms:`, error);
    
    if (error instanceof ZodError) {
      return { success: false, error: formatZodError(error) };
    }
    
    return { success: false, error: 'Failed to update blog post' };
  }
}


export async function deleteBlogPost(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    console.warn('⚠️ Unauthorized blog post deletion attempt');
    return { success: false, error: 'Unauthorized' };
  }

  const startTime = Date.now();
  console.log(`🗑️ Deleting blog post ${id}...`);

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!post) {
      console.warn(`⚠️ Blog post ${id} not found for deletion`);
      return { success: false, error: 'Post not found' };
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    const deleteTime = Date.now() - startTime;
    console.log(`✅ Blog post deleted in ${deleteTime}ms: ${post.slug}`);

    await invalidateBlogPostCache(post.slug);
    await invalidateHomeCache()
    
    return { success: true };
    
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Error deleting blog post ${id} after ${errorTime}ms:`, error);
    return { success: false, error: 'Failed to delete blog post' };
  }
}


export async function toggleBlogPostPublish(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    console.warn('⚠️ Unauthorized publish toggle attempt');
    return { success: false, error: 'Unauthorized' };
  }

  const startTime = Date.now();
  console.log(`🔄 Toggling publish status for post ${id}...`);

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { published: true, slug: true }, // ✅ Added slug
    });

    if (!post) {
      console.warn(`⚠️ Blog post ${id} not found for toggle`);
      return { success: false, error: 'Post not found' };
    }

    const newPublished = !post.published;
    console.log(`📊 Publish change: ${post.published} → ${newPublished}`);

    await prisma.blogPost.update({
      where: { id },
       data: {
        published: newPublished,
        publishedAt: newPublished ? new Date() : null,
      },
    });

    const toggleTime = Date.now() - startTime;
    console.log(`✅ Publish status toggled in ${toggleTime}ms: ${post.slug}`);

    await invalidateBlogPostCache(post.slug);
    await invalidateHomeCache()
    
    return { success: true, published: newPublished };
    
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Error toggling publish status for ${id} after ${errorTime}ms:`, error);
    return { success: false, error: 'Failed to toggle publish status' };
  }
}

export async function manualInvalidateBlogCache(
  secret: string, 
  postSlug?: string
) {
  if (secret !== process.env.REVALIDATE_SECRET) {
    console.warn('⚠️ Invalid secret for manual cache invalidation');
    return { success: false, error: 'Unauthorized' };
  }

  console.log('🔄 Manual blog cache invalidation triggered');
  await invalidateBlogPostCache(postSlug);
  
  return { success: true };
}