// app/(admin)/admin/projects/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ProjectForm } from '@/components/admin/ProjectForm';

export const metadata: Metadata = {
  title: 'Edit Project | Admin',
  description: 'Edit project details, gallery, and settings.',
};

// ✅ Enable ISR for fast loads
export const revalidate = 3600; // 1 hour

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  
  // ✅ Fetch project with ALL relations needed for form
  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      description: true,
      thumbnail: true,
      images: true, // ✅ Gallery images
      demoUrl: true,
      repoUrl: true,
      featured: true,
      status: true,
      order: true,
      createdAt: true,
      updatedAt: true,
      // ✅ Relations
      tags: {
        select: { id: true, name: true, slug: true, color: true },
      },
      metrics: {
        select: { id: true, label: true, value: true },
      },
    },
  });

  if (!project) {
    notFound();
  }

  // ✅ Fetch available tags for tag selector
  const availableTags = await prisma.tag.findMany({
    select: { id: true, name: true, slug: true, color: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Edit Project</h1>
          <p className="text-gray-400 mt-1">
            Update details, gallery, and settings for &quot;{project.title}&quot;
          </p>
        </div>

        {/* Form */}
        <ProjectForm 
          project={project} 
          availableTags={availableTags} 
          mode="edit" 
        />
      </div>
    </div>
  );
}