// components/features/projects/project-grid.tsx
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
  projects: Array<{
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail: string;
    featured: boolean;
    demoUrl?: string | null;
    repoUrl?: string | null;
    tags: Array<{ id: string; name: string; slug: string; color: string }>;
    metrics: Array<{ id: string; label: string; value: string }>;
  }>;
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}