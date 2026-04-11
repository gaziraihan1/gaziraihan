// components/features/home/tech-stack-card.tsx
'use client';

import { motion } from 'framer-motion';
import { Code2, Database, Layout, Server, Globe, Smartphone, Palette } from 'lucide-react';
import { BentoCard } from '@/components/animations/BentoCard';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TechSkill } from '@/types/skills';

interface TechStackCardProps {
  skills: TechSkill[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  Frontend: <Layout className="w-4 h-4" />,
  Backend: <Server className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  Design: <Palette className="w-4 h-4" />,
  DevOps: <Server className="w-4 h-4" />,
  Mobile: <Smartphone className="w-4 h-4" />,
  Testing: <Code2 className="w-4 h-4" />,
  Other: <Globe className="w-4 h-4" />, 
};

export function TechStackCard({ skills }: TechStackCardProps) {
  const groupedSkills = useMemo(() => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, TechSkill[]>);
  }, [skills]); 

  return (
    <div className="md:col-span-1 md:row-span-1">
      <BentoCard gradientColor="cyan" className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Tech Stack</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {categoryIcons[category] || categoryIcons.Other}
                  <span className="text-xs font-medium text-gray-400">{category}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categorySkills.slice(0, 4).map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="outline"
                      className={cn(
                        "text-xs cursor-default transition-colors",
                        // ✅ Add hover effect for better UX
                        "hover:border-cyan-500/50 hover:text-cyan-300"
                      )}
                      // ✅ Accessibility: Describe the skill
                      aria-label={`Skill: ${skill.name}, proficiency: ${skill.proficiency}%`}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                  {categorySkills.length > 4 && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                      aria-label={`${categorySkills.length - 4} more ${category} skills`}
                    >
                      +{categorySkills.length - 4}
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              href="/uses"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group"
              aria-label="View my complete technology stack and tools"
            >
              View full stack
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}