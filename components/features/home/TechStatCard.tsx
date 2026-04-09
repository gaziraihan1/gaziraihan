// components/features/home/tech-stack-card.tsx
'use client';

import { motion } from 'framer-motion';
import { Code2, Database, Layout, Server } from 'lucide-react';
import { BentoCard } from '@/components/animations/BentoCard';
import { Badge } from '@/components/ui/badge';
import { Skill } from '@/generated/prisma/client';
import Link from 'next/link';

interface TechStackCardProps {
  skills: Skill[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  Frontend: <Layout className="w-4 h-4" />,
  Backend: <Server className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  Design: <Code2 className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  Frontend: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  Backend: 'text-green-400 bg-green-500/10 border-green-500/20',
  Database: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Design: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
};

export function TechStackCard({ skills }: TechStackCardProps) {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="md:col-span-1 md:row-span-1">
      <BentoCard gradientColor="cyan" className="h-full">
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Tech Stack</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2">
                  {categoryIcons[category]}
                  <span className="text-xs font-medium text-gray-400">{category}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.slice(0, 4).map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="outline"
                      className="text-xs"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                  {categorySkills.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{categorySkills.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              href="/uses"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              View full stack →
            </Link>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}