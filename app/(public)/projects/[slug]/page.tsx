import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { prisma } from '@/lib/prisma';
import { ReadingProgress } from '@/components/features/projects/ReadingProgress';
import { ProjectDetail } from '@/components/features/projects/ProjectDetail';
import { ProjectTag } from '@/types/project';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { tags: true },
  });

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.title} | ${siteConfig.name}`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | ${siteConfig.name}`,
      description: project.summary,
      url: `${siteConfig.url}/projects/${project.slug}`,
      siteName: siteConfig.name,
      images: [project.thumbnail],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | ${siteConfig.name}`,
      description: project.summary,
      images: [project.thumbnail],
    },
  };
}
export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { status: 'LIVE' },
    select: { slug: true }
  });
  return projects.map(p => ({ slug: p.slug }));
}

async function getProjectData(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        tags: true,
        metrics: true,
      },
    });

    if (!project) return null;

    const [previousProject, nextProject] = await Promise.all([
      prisma.project.findFirst({
        where: { 
          id: { lt: project.id }, 
          status: 'LIVE' 
        },
        orderBy: { id: 'desc' },
        select: { slug: true, title: true, thumbnail: true },
      }),
      prisma.project.findFirst({
        where: { 
          id: { gt: project.id }, 
          status: 'LIVE' 
        },
        orderBy: { id: 'asc' },
        select: { slug: true, title: true, thumbnail: true },
      }),
    ]);

    return { project, previousProject, nextProject };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

function generateSchema(project: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    headline: project.title,
    description: project.summary,
    image: project.thumbnail,
    url: `${siteConfig.url}/projects/${project.slug}`,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    keywords: project.tags.map((t: ProjectTag) => t.name).join(', '),
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const data = await getProjectData(slug);

  if (!data || !data.project) {
    notFound();
  }

  const { project, previousProject, nextProject } = data;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSchema(project)) }}
      />
      
      <ReadingProgress />

      <ProjectDetail
        project={project}
        previousProject={previousProject}
        nextProject={nextProject}
      />
    </>
  );
}