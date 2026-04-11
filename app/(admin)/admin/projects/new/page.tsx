import { ProjectForm } from '@/components/admin/ProjectForm';
import BackButton from '@/components/features/projects/BackButton';
import { prisma } from '@/lib/prisma';

export default async function NewProjectPage() {
  const availableTags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold text-white">Create Project</h1>
          <p className="text-gray-400">Add a new project to your portfolio</p>
        </div>
      </div>
      
      <ProjectForm
        availableTags={availableTags}
      />
    </div>
  );
}