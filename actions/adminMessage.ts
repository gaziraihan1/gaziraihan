"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { cache, cachedQuery } from "@/lib/cache";

const messageStatusSchema = z.enum(["UNREAD", "READ", "ARCHIVED"]);

export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  createdAt: Date;
  ipAddr: string | null;
  userAgent: string | null;
};

const MESSAGES_CACHE_KEY = "admin:messages";
const MESSAGES_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getAdminMessages({
  page = 1,
  limit = 20,
  search,
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "UNREAD" | "READ" | "ARCHIVED";
}): Promise<{
  messages: AdminMessage[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> {
  return cachedQuery(
    `${MESSAGES_CACHE_KEY}:page=${page}:limit=${limit}:search=${search || ""}:status=${status || "all"}`,
    async () => {
      console.log(`🔍 Fetching admin messages (page ${page})...`);
      const fetchStart = Date.now();
      
      const skip = (page - 1) * limit;
      const where: any = {};
      
      if (status && status !== "all") {
        where.status = status;
      }
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { subject: { contains: search, mode: "insensitive" } },
          { message: { contains: search, mode: "insensitive" } },
        ];
      }
      
      const [messages, totalCount] = await Promise.all([
        prisma.contactMessage.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            subject: true,
            message: true,
            status: true,
            createdAt: true,
            ipAddr: true,
            userAgent: true,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.contactMessage.count({ where }),
      ]);
      
      const fetchTime = Date.now() - fetchStart;
      console.log(`✅ Fetched ${messages.length} messages in ${fetchTime}ms`);
      
      return {
        messages: messages as AdminMessage[],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalMessages: totalCount,
          hasNextPage: skip + limit < totalCount,
          hasPrevPage: page > 1,
        },
      };
    },
    MESSAGES_CACHE_TTL
  );
}

export async function updateMessageStatus(id: string, status: string) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validatedStatus = messageStatusSchema.parse(status);

  try {
    await prisma.contactMessage.update({
      where: { id },
      data: {
        status: validatedStatus,
      },
    });

    cache.delete(MESSAGES_CACHE_KEY);
    revalidatePath("/admin/messages");
    revalidatePath("/contact");
    return { success: true };
  } catch (error) {
    console.error("Error updating message status:", error);
    return { success: false, error: "Failed to update message status" };
  }
}

export async function deleteMessage(id: string) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.contactMessage.delete({
      where: { id },
    });

    cache.delete(MESSAGES_CACHE_KEY);
    revalidatePath("/admin/messages");
    revalidatePath("/contact");
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false, error: "Failed to delete message" };
  }
}

export async function bulkUpdateStatus(ids: string[], status: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validatedStatus = messageStatusSchema.parse(status);

  try {
    await prisma.contactMessage.updateMany({
      where: { id: { in: ids } },
      data: { status: validatedStatus },
    });

    cache.delete(MESSAGES_CACHE_KEY);
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Error bulk updating status:", error);
    return { success: false, error: "Failed to update messages" };
  }
}

export async function bulkDeleteMessages(ids: string[]) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.contactMessage.deleteMany({
      where: { id: { in: ids } },
    });

    cache.delete(MESSAGES_CACHE_KEY);
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting messages:", error);
    return { success: false, error: "Failed to delete messages" };
  }
}