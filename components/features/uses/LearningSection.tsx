// components/features/uses/LearningSection.tsx
'use client';

import { UsesLearningItem } from '@/actions/uses';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';

interface LearningSectionProps {
  resources: UsesLearningItem[];
}

export function LearningSection({ resources }: LearningSectionProps) {
  if (resources.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Learning Resources</h2>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {resources.map((item, index) => (
          <motion.a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                  {item.name}
                </h4>
                {item.description && (
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-colors shrink-0" />
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}