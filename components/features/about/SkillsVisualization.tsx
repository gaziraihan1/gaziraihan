'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Database, Layout, Server, Palette } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string | null;
}

interface SkillsVisualizationProps {
  skillsByCategory: Record<string, Skill[]>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Frontend: <Layout className="w-5 h-5" />,
  Backend: <Server className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Design: <Palette className="w-5 h-5" />,
  Other: <Code2 className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  Frontend: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
  Backend: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  Database: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
  Design: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
  Other: 'from-gray-500/20 to-slate-500/20 border-gray-500/30',
};

export function SkillsVisualization({ skillsByCategory }: SkillsVisualizationProps) {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-2">
          <Code2 className="w-6 h-6 text-indigo-400" />
          <h2 className="text-3xl font-bold text-white">Skills & Technologies</h2>
        </div>
        <p className="text-gray-400">My technical expertise and proficiency levels</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(skillsByCategory).map(([category, skills], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: categoryIndex * 0.1 }}
            className={`bg-linear-to-br ${categoryColors[category] || categoryColors.Other} border rounded-2xl p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-white/10">
                {categoryIcons[category] || categoryIcons.Other}
              </div>
              <h3 className="text-xl font-semibold text-white">{category}</h3>
            </div>

            <div className="space-y-4">
              {skills.map((skill, skillIndex) => (
                <SkillBar key={skill.id} skill={skill} index={skillIndex} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">{skill.name}</span>
        <span className="text-xs text-gray-500">{skill.proficiency}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${skill.proficiency}%` : 0 }}
          transition={{ duration: 1, delay: index * 0.1 }}
          className="h-full bg-linear-to-r from-indigo-500 to-cyan-500 rounded-full"
        />
      </div>
    </div>
  );
}