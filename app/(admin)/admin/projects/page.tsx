import { prisma } from '@/lib/prisma';
import { ProjectsTable } from '@/components/admin/ProjectsTable';
import CreateProjectButton from '@/components/admin/CreateProjectButton';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { tags: true, metrics: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage your portfolio projects</p>
        </div>
        
        <CreateProjectButton />
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}