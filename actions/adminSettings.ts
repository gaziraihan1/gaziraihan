"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const siteConfigSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string(),
  type: z.enum(["string", "json", "boolean"]).default("string"),
});

type SiteConfigData = z.infer<typeof siteConfigSchema>;

export async function updateSiteConfig(rawData: SiteConfigData) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const data = siteConfigSchema.parse(rawData);

  try {
    const config = await prisma.siteConfig.upsert({
      where: { key: data.key },
      update: {
        value: data.value,
        type: data.type,
      },
      create: {
        key: data.key,
        value: data.value,
        type: data.type,
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, config };
  } catch (error) {
    console.error("Error updating site config:", error);
    return { success: false, error: "Failed to update site config" };
  }
}

export async function bulkUpdateSiteConfig(
  items: Array<{ key: string; value: string }>,
) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.siteConfig.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value },
        }),
      ),
    );

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error bulk updating site config:", error);
    return { success: false, error: "Failed to update site config" };
  }
}


import bcrypt from "bcryptjs";


const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

export async function updateProfile(rawData: z.infer<typeof profileSchema>) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const data = profileSchema.parse(rawData);
    const userId = session.user.id;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, password: true },
    });

    if (!currentUser) {
      return { success: false, error: 'User not found' };
    }

    if (data.email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        return { success: false, error: 'Email already in use' };
      }
    }

    if (data.newPassword) {
      if (!data.currentPassword) {
        return { success: false, error: 'Current password is required' };
      }
      const isCorrect = await bcrypt.compare(data.currentPassword, currentUser.password);
      if (!isCorrect) {
        return { success: false, error: 'Current password is incorrect' };
      }
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
    };

    if (data.newPassword) {
      updateData.password = await bcrypt.hash(data.newPassword, 10);
    }

    await prisma.user.update({
      where: { id: userId },
       data: updateData,
    });

    revalidatePath('/admin/settings');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function getAdminSettings() {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  const configEntries = await prisma.siteConfig.findMany({
    select: { key: true, value: true, type: true },
  });

  const configMap = Object.fromEntries(
    configEntries.map((entry) => [
      entry.key,
      entry.type === 'json' ? JSON.parse(entry.value) : entry.value,
    ])
  );

  return {
    user,
    config: configMap
  }
}