// actions/admin-software.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z, ZodError } from 'zod';
import { cache } from '@/lib/cache';
import { auth } from '@/lib/auth';

const softwareSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  category: z.string().min(2, 'Category is required'),
  description: z.string().max(1000).optional().or(z.literal('')),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isPaid: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
  order: z.number().int().default(0),
});

export type SoftwareInput = z.infer<typeof softwareSchema>;

export async function createSoftware(rawData: SoftwareInput) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const data = softwareSchema.parse(rawData);
    
    const software = await prisma.software.create({
      data: {
        ...data,
        websiteUrl: data.websiteUrl || null,
        description: data.description || null,
      },
    });

    cache.delete('uses:data');
    revalidatePath('/uses');
    revalidatePath('/admin/uses/software');

    return { success: true, software };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to create software' };
  }
}

export async function updateSoftware(id: string, rawData: SoftwareInput) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const data = softwareSchema.parse(rawData);
    
    const software = await prisma.software.update({
      where: { id },
      data: {
        ...data,
        websiteUrl: data.websiteUrl || null,
        description: data.description || null,
      },
    });

    cache.delete('uses:data');
    revalidatePath('/uses');
    revalidatePath('/admin/uses/software');

    return { success: true, software };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to update software' };
  }
}

export async function deleteSoftware(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.software.delete({ where: { id } });
    
    cache.delete('uses:data');
    revalidatePath('/uses');
    revalidatePath('/admin/uses/software');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete software' };
  }
}

export async function reorderSoftware(id: string, newOrder: number) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.software.update({
      where: { id },
      data: { order: newOrder },
    });

    cache.delete('uses:data');
    revalidatePath('/admin/uses/software');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to reorder software' };
  }
}