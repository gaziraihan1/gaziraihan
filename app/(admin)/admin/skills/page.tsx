import { SkillsManager } from '@/components/admin/SkillsManager';
import { prisma } from '@/lib/prisma';

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });

  return <SkillsManager skills={skills} />;
}