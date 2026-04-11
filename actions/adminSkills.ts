'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { cache } from '@/lib/cache';

const skillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  proficiency: z.number().min(0).max(100),
  icon: z.string().optional().nullable(),
  order: z.number().default(0),
});

type SkillData = z.infer<typeof skillSchema>;

export async function invalidateHomeCache() {
  cache.delete('home:skills');
  revalidatePath('/');
  console.log('✅ Home skills cache invalidated');
}

export async function createSkill(rawData: SkillData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const data = skillSchema.parse(rawData);

  try {
    const skill = await prisma.skill.create({
      data: {  // ✅ CORRECT: Added "data:" key
        name: data.name,
        category: data.category,
        proficiency: data.proficiency,
        icon: data.icon || null,
        order: data.order,
      },
    });

    revalidatePath('/admin/skills');
    revalidatePath('/');
    revalidatePath('/about');
    return { success: true, skill };
  } catch (error) {
    console.error('Error creating skill:', error);
    return { success: false, error: 'Failed to create skill' };
  }
}

export async function updateSkill(id: string, rawData: SkillData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const data = skillSchema.parse(rawData);

  try {
    const skill = await prisma.skill.update({
      where: { id },
      data: {  // ✅ CORRECT: Added "data:" key
        name: data.name,
        category: data.category,
        proficiency: data.proficiency,
        icon: data.icon || null,
        order: data.order,
      },
    });

    revalidatePath('/admin/skills');
    revalidatePath('/');
    revalidatePath('/about');
    return { success: true, skill };
  } catch (error) {
    console.error('Error updating skill:', error);
    return { success: false, error: 'Failed to update skill' };
  }
}

export async function deleteSkill(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    await prisma.skill.delete({
      where: { id },
    });

    revalidatePath('/admin/skills');
    revalidatePath('/');
    revalidatePath('/about');
    return { success: true };
  } catch (error) {
    console.error('Error deleting skill:', error);
    return { success: false, error: 'Failed to delete skill' };
  }
}