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
