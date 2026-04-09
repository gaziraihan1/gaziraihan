// actions/admin-messages.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const messageStatusSchema = z.enum(['UNREAD', 'READ', 'ARCHIVED']);

export async function updateMessageStatus(id: string, status: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const validatedStatus = messageStatusSchema.parse(status);

  try {
    await prisma.contactMessage.update({
      where: { id },
      data: {  // ✅ CORRECT: Added "data:" key
        status: validatedStatus,
      },
    });

    revalidatePath('/admin/messages');
    revalidatePath('/contact');
    return { success: true };
  } catch (error) {
    console.error('Error updating message status:', error);
    return { success: false, error: 'Failed to update message status' };
  }
}

export async function deleteMessage(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    await prisma.contactMessage.delete({
      where: { id },
    });

    revalidatePath('/admin/messages');
    revalidatePath('/contact');
    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error: 'Failed to delete message' };
  }
}