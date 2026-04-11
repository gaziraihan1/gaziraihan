'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z, ZodError } from 'zod';
import { cache } from '@/lib/cache';

export type CreateProjectInput = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  thumbnail: string;
  images?: string[];
  demoUrl?: string | null;
  repoUrl?: string | null;
  featured: boolean;
  status: 'LIVE' | 'ARCHIVED' | 'IN_PROGRESS';
  tags: string[];
  metrics?: Array<{ label: string; value: string }>;
};

const projectSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(200, 'Slug must be less than 200 characters'),
  summary: z.string()
    .min(20, 'Summary must be at least 20 characters')
    .max(500, 'Summary must be less than 500 characters'),
  description: z.string()
    .min(100, 'Description must be at least 100 characters'),
  thumbnail: z.string().url('Thumbnail must be a valid URL'),
  images: z.array(
    z.string().url('Each image must be a valid URL')
  ).optional(),
  demoUrl: z.string()
    .url('Demo URL must be a valid URL')
    .optional()
    .or(z.literal('')),
  repoUrl: z.string()
    .url('Repo URL must be a valid URL')
    .optional()
    .or(z.literal('')),
  featured: z.boolean(),
  
  status: z.enum(['LIVE', 'ARCHIVED', 'IN_PROGRESS'], {
    message: 'Status must be LIVE, ARCHIVED, or IN_PROGRESS',
  }),
  
  tags: z.array(
    z.string().min(1, 'Tag cannot be empty')
  ),
  metrics: z.array(
    z.object({
      label: z.string().min(1, 'Metric label cannot be empty'),
      value: z.string().min(1, 'Metric value cannot be empty'),
    })
  ).optional(),
});

export async function invalidateHomeCache() {
  console.log('🔄 Invalidating home page cache...');
  
  cache.delete('home:skills');
  cache.delete('home:projects');
  cache.delete('home:experience');
  cache.delete('home:blog');
  
  revalidatePath('/');
  revalidatePath('/projects');
  revalidatePath('/blog');
  
  console.log('✅ Home page cache invalidated');
}

const CACHE_KEYS = {
  FILTERS: 'projects:filters',
  POSTS: (params: { page: number; search?: string; tag?: string }) => 
    `projects:page=${params.page}:search=${params.search || ''}:tag=${params.tag || ''}`,
} as const;

async function invalidateProjectsCache(projectSlug?: string) {
  console.log('🔄 Invalidating projects cache...');
  
  cache.delete(CACHE_KEYS.FILTERS);
  
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/');
  
  if (projectSlug) {
    revalidatePath(`/projects/${projectSlug}`);
  }
  
  console.log('✅ Projects cache invalidated');
}

function formatZodError(error: ZodError): string {
  return error.issues
    .map(issue => {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'field';
      return `${path}: ${issue.message}`;
    })
    .join(', ');
}


export async function createProject(rawData: CreateProjectInput) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    console.warn('⚠️ Unauthorized project creation attempt');
    return { success: false, error: 'Unauthorized' };
  }

  const startTime = Date.now();
  console.log('📝 Creating project...');

  try {
    const data = projectSchema.parse(rawData);
    console.log('✅ Input validated');

    const project = await prisma.project.create({
       data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        description: data.description,
        thumbnail: data.thumbnail,
        images: data.images || [],
        demoUrl: data.demoUrl || null,
        repoUrl: data.repoUrl || null,
        featured: data.featured,
        status: data.status,
        tags: {
          connect: data.tags.map((slug) => ({ slug })),
        },
        metrics: {
          create: data.metrics?.map((metric) => ({
            label: metric.label,
            value: metric.value,
          })) || [],
        },
      },
    });

    const createTime = Date.now() - startTime;
    console.log(`✅ Project created in ${createTime}ms: ${project.slug}`);

    await invalidateProjectsCache(project.slug);
    await invalidateHomeCache()
    
    return { success: true, project };
    
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Error creating project after ${errorTime}ms:`, error);
    
    if (error instanceof ZodError) {
      return { success: false, error: formatZodError(error) };
    }
    
    return { success: false, error: 'Failed to create project' };
  }
}


export async function updateProject(id: string, rawData: CreateProjectInput) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    console.warn('⚠️ Unauthorized project update attempt');
    return { success: false, error: 'Unauthorized' };
  }

  const startTime = Date.now();
  console.log(`✏️ Updating project ${id}...`);

  try {
    const data = projectSchema.parse(rawData);
    console.log('✅ Input validated');

    const currentProject = await prisma.project.findUnique({
      where: { id },
      select: { slug: true },
    });
    console.log('✅ Current project fetched');

    const project = await prisma.project.update({
      where: { id },
       data:{
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        description: data.description,
        thumbnail: data.thumbnail,
        images: data.images || [],
        demoUrl: data.demoUrl || null,
        repoUrl: data.repoUrl || null,
        featured: data.featured,
        status: data.status,
        tags: {
          set: data.tags.map((slug) => ({ slug })),
        },
        metrics: {
          deleteMany: {},
          create: data.metrics?.map((metric) => ({
            label: metric.label,
            value: metric.value,
          })) || [],
        },
      },
    });

    const updateTime = Date.now() - startTime;
    console.log(`✅ Project updated in ${updateTime}ms: ${project.slug}`);

    await invalidateProjectsCache(currentProject?.slug);
    await invalidateProjectsCache(project.slug);
    await invalidateHomeCache()
    
    return { success: true, project };
    
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Error updating project ${id} after ${errorTime}ms:`, error);
    
    if (error instanceof ZodError) {
      return { success: false, error: formatZodError(error) };
    }
    
    return { success: false, error: 'Failed to update project' };
  }
}


export async function deleteProject(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    console.warn('⚠️ Unauthorized project deletion attempt');
    return { success: false, error: 'Unauthorized' };
  }

  const startTime = Date.now();
  console.log(`🗑️ Deleting project ${id}...`);

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!project) {
      console.warn(`⚠️ Project ${id} not found for deletion`);
      return { success: false, error: 'Project not found' };
    }

    await prisma.project.delete({
      where: { id },
    });

    const deleteTime = Date.now() - startTime;
    console.log(`✅ Project deleted in ${deleteTime}ms: ${project.slug}`);

    await invalidateProjectsCache(project.slug);
    await invalidateHomeCache()
    
    return { success: true };
    
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Error deleting project ${id} after ${errorTime}ms:`, error);
    return { success: false, error: 'Failed to delete project' };
  }
}


export async function toggleProjectStatus(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    console.warn('⚠️ Unauthorized status toggle attempt');
    return { success: false, error: 'Unauthorized' };
  }

  const startTime = Date.now();
  console.log(`🔄 Toggling status for project ${id}...`);

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      select: { status: true, slug: true },
    });

    if (!project) {
      console.warn(`⚠️ Project ${id} not found for status toggle`);
      return { success: false, error: 'Project not found' };
    }

    const newStatus = project.status === 'LIVE' ? 'ARCHIVED' : 'LIVE';
    console.log(`📊 Status change: ${project.status} → ${newStatus}`);

    await prisma.project.update({
      where: { id },
       data:{ status: newStatus },
    });

    const toggleTime = Date.now() - startTime;
    console.log(`✅ Status toggled in ${toggleTime}ms: ${project.slug}`);

    await invalidateProjectsCache(project.slug);
    await invalidateHomeCache()
    
    return { success: true, status: newStatus };
    
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Error toggling status for ${id} after ${errorTime}ms:`, error);
    return { success: false, error: 'Failed to toggle status' };
  }
}


export async function bulkUpdateProjectsStatus(
  ids: string[], 
  status: 'LIVE' | 'ARCHIVED'
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    console.warn('⚠️ Unauthorized bulk update attempt');
    return { success: false, error: 'Unauthorized' };
  }

  const startTime = Date.now();
  console.log(`📦 Bulk updating ${ids.length} projects to ${status}...`);

  try {
    const projects = await prisma.project.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    });
    console.log(`✅ Fetched ${projects.length} projects for invalidation`);

    const result = await prisma.project.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });
    console.log(`✅ Updated ${result.count} projects`);

    for (const project of projects) {
      if (project.slug) {
        await invalidateProjectsCache(project.slug);
      }
    }
    await invalidateHomeCache()

    const bulkTime = Date.now() - startTime;
    console.log(`✅ Bulk update completed in ${bulkTime}ms`);
    
    return { success: true, updatedCount: result.count };
    
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Error in bulk update after ${errorTime}ms:`, error);
    return { success: false, error: 'Failed to bulk update projects' };
  }
}

export async function manualInvalidateProjectsCache(
  secret: string, 
  projectSlug?: string
) {
  if (secret !== process.env.REVALIDATE_SECRET) {
    console.warn('⚠️ Invalid secret for manual cache invalidation');
    return { success: false, error: 'Unauthorized' };
  }

  console.log('🔄 Manual cache invalidation triggered');
  await invalidateProjectsCache(projectSlug);
  
  return { success: true };
}