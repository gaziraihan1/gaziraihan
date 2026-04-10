// types/project.ts
import type { Project, Tag, ProjectMetric } from '@prisma/client';


export interface ProjectFilterState {
  page: number;
  search: string;
  tag: string;
  category: string;
}

export interface ProjectPagination {
  currentPage: number;
  totalPages: number;
  totalProjects: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
// types/project.ts

// ✅ Full project type with all relations
export type ProjectWithRelations = Project & {
  tags: Tag[];
  metrics: ProjectMetric[];
  images: string[];
  demoUrl: string | null;
  repoUrl: string | null;
};

// ✅ Simplified type for navigation (prev/next)
export interface NavigationProject {
  slug: string;
  title: string;
  thumbnail: string;
}

// ✅ Props for ProjectDetail component
export interface ProjectDetailProps {
  project: ProjectWithRelations;
  previousProject: NavigationProject | null;
  nextProject: NavigationProject | null;
}

export type ProjectTag = {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
};