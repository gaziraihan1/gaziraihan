// actions/admin-hardware.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z, ZodError } from 'zod';
import { cache } from '@/lib/cache';
import { auth } from '@/lib/auth';

const hardwareSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  category: z.string().min(2, 'Category is required'),
  description: z.string().max(1000).optional().or(z.literal('')),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  purchaseUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  price: z.string().max(50).optional().or(z.literal('')),
  isFavorite: z.boolean().default(false),
  order: z.number().int().default(0).optional(),
});

export type HardwareInput = z.infer<typeof hardwareSchema>;

export async function createHardware(rawData: HardwareInput) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const data = hardwareSchema.parse(rawData);
    
    const hardware = await prisma.hardware.create({
      data: {
        ...data,
        order: data.order ?? 0,
        imageUrl: data.imageUrl || null,
        purchaseUrl: data.purchaseUrl || null,
        price: data.price || null,
        description: data.description || null,
      },
    });

    cache.delete('uses:data');
    revalidatePath('/uses');
    revalidatePath('/admin/uses/hardware');

    return { success: true, hardware };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to create hardware' };
  }
}

export async function updateHardware(id: string, rawData: HardwareInput) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const data = hardwareSchema.parse(rawData);
    
    const hardware = await prisma.hardware.update({
      where: { id },
      data: {
        ...data,
        ...(data.order !== undefined && { order: data.order }),
        imageUrl: data.imageUrl || null,
        purchaseUrl: data.purchaseUrl || null,
        price: data.price || null,
        description: data.description || null,
      },
    });

    cache.delete('uses:data');
    revalidatePath('/uses');
    revalidatePath('/admin/uses/hardware');

    return { success: true, hardware };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to update hardware' };
  }
}

export async function deleteHardware(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.hardware.delete({ where: { id } });
    
    cache.delete('uses:data');
    revalidatePath('/uses');
    revalidatePath('/admin/uses/hardware');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete hardware' };
  }
}

export async function reorderHardware(id: string, newOrder: number) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.hardware.update({
      where: { id },
      data: { order: newOrder },
    });

    cache.delete('uses:data');
    revalidatePath('/admin/uses/hardware');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to reorder hardware' };
  }
}