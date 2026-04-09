// components/features/home/experience-card.tsx
'use client';

import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { BentoCard } from '@/components/animations/BentoCard';
import { Badge } from '@/components/ui/badge';
import { Experience } from '@/generated/prisma/client';
import Link from 'next/link';

interface ExperienceCardProps {
  experience: Experience[];
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="md:col-span-1 md:row-span-2">
      <BentoCard gradientColor="green" className="h-full">
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Experience</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6">
            {experience.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-6 border-l-2 border-white/10"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-1.25 top-0 w-2.5 h-2.5 rounded-full bg-green-500" />

                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{job.role}</h4>
                    <p className="text-xs text-gray-400">{job.company}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                      {formatDate(job.startDate)} - {formatDate(job.endDate)}
                    </Badge>
                    {job.isCurrent && (
                      <Badge className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 border-green-500/30">
                        Current
                      </Badge>
                    )}
                  </div>

                  {job.highlights.length > 0 && (
                    <ul className="text-xs text-gray-500 space-y-1">
                      {job.highlights.slice(0, 2).map((highlight, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              href="/about"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              View full timeline →
            </Link>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}