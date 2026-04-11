import { ExperienceManager } from '@/components/admin/ExperinceManager';
import { prisma } from '@/lib/prisma';

export default async function AdminExperiencePage() {
  const experience = await prisma.experience.findMany({
    orderBy: { order: 'asc' },
  });

  return <ExperienceManager experience={experience} />;
}