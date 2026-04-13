// app/(public)/uses/page.tsx
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { getUsesData } from '@/actions/uses';
import { UsesHero } from '@/components/features/uses/UsesHero';
import { SkillsSection } from '@/components/features/uses/SkillsSection';
import { HardwareSection } from '@/components/features/uses/HardwareSection';
import { SoftwareSection } from '@/components/features/uses/SoftwareSection';
import { WorkflowSection } from '@/components/features/uses/WorkflowSection';
import { LearningSection } from '@/components/features/uses/LearningSection';

export const metadata: Metadata = {
  title: 'Uses | Tools & Setup',
  description: 'The tools, software, hardware, and workflow I use to build web applications and create content.',
  openGraph: {
    title: `Uses | ${siteConfig.name}`,
    description: 'My development setup, tools, and workflow.',
    url: `${siteConfig.url}/uses`,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Uses | ${siteConfig.name}`,
    description: 'My development setup, tools, and workflow.',
    images: [siteConfig.ogImage],
  },
};

// ✅ Enable ISR (uses page rarely changes)
export const revalidate = 3600; // 24 hours

export default async function UsesPage() {
  // ✅ Fetch all data server-side (cached, no N+1)
  const data = await getUsesData();
  
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-5xl mx-auto space-y-24">
        <UsesHero />
        <SkillsSection skillsByCategory={data.skillsByCategory} />
        <HardwareSection hardware={data.hardware} />
        <SoftwareSection software={data.software} />
        <WorkflowSection workflow={data.workflow} />
        <LearningSection resources={data.learning} />
      </div>
    </div>
  );
}