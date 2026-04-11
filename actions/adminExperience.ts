"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z, ZodError } from "zod";
import { cache } from "@/lib/cache";

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(200),
  role: z.string().min(1, "Role is required").max(200),
  location: z.string().optional().nullable(),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  endDate: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => (val ? new Date(val) : null)),
  isCurrent: z.boolean(),
  description: z.string().optional().nullable(),
  highlights: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  order: z.number().default(0),
});

export type CreateExperienceInput = {
  company: string;
  role: string;
  location: string | null;
  startDate: string; // ✅ String in YYYY-MM-DD format (client sends this)
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  highlights: string[];
  technologies: string[];
  order: number;
};

export async function invalidateHomeCache() {
  cache.delete("home:experience");
  revalidatePath("/");
  console.log("✅ Home experience cache invalidated");
}

export async function createExperience(rawData: CreateExperienceInput) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const data = experienceSchema.parse(rawData);

    const experience = await prisma.experience.create({
      data: {
        company: data.company,
        role: data.role,
        location: data.location || null,
        startDate: data.startDate, // Now a Date after Zod transform
        endDate: data.endDate || null,
        isCurrent: data.isCurrent,
        description: data.description || "",
        highlights: data.highlights,
        technologies: data.technologies,
        order: data.order,
      },
    });

    revalidatePath("/admin/experience");
    revalidatePath("/");
    revalidatePath("/about");
    return { success: true, experience };
  } catch (error) {
    console.error("Error creating experience:", error);

    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", "),
      };
    }

    return { success: false, error: "Failed to create experience" };
  }
}

export async function updateExperience(
  id: string,
  rawData: CreateExperienceInput,
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const data = experienceSchema.parse(rawData);

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        company: data.company,
        role: data.role,
        location: data.location || null,
        startDate: data.startDate,
        endDate: data.endDate || null,
        isCurrent: data.isCurrent,
        description: data.description || "",
        highlights: data.highlights,
        technologies: data.technologies,
        order: data.order,
      },
    });

    revalidatePath("/admin/experience");
    revalidatePath("/");
    revalidatePath("/about");
    await invalidateHomeCache();
    return { success: true, experience };
  } catch (error) {
    console.error("Error updating experience:", error);

    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", "),
      };
    }

    return { success: false, error: "Failed to update experience" };
  }
}

export async function deleteExperience(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.experience.delete({ where: { id } });

    revalidatePath("/admin/experience");
    revalidatePath("/");
    revalidatePath("/about");
    await invalidateHomeCache();
    return { success: true };
  } catch (error) {
    console.error("Error deleting experience:", error);
    return { success: false, error: "Failed to delete experience" };
  }
}
