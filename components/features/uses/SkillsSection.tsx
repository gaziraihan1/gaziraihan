'use client';

import { UsesSkill } from '@/types/uses';
import { motion } from 'framer-motion';
import { Code2, Database, Layout, Server, Palette, Globe, Smartphone, Shield } from 'lucide-react';

interface SkillsSectionProps {
  skillsByCategory: Record<string, UsesSkill[]>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Frontend: <Layout className="w-5 h-5" />,
  Backend: <Server className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Design: <Palette className="w-5 h-5" />,
  DevOps: <Globe className="w-5 h-5" />,
  Mobile: <Smartphone className="w-5 h-5" />,
  Security: <Shield className="w-5 h-5" />,
  Other: <Code2 className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  Frontend: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  Backend: 'text-green-400 bg-green-500/10 border-green-500/20',
  Database: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Design: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  DevOps: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Mobile: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Security: 'text-red-400 bg-red-500/10 border-red-500/20',
  Other: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
};

export function SkillsSection({ skillsByCategory }: SkillsSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <Code2 className="w-6 h-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
      </div>
      
      <div className="grid gap-8">
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <motion.div key={category} variants={item} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${categoryColors[category] || categoryColors.Other}`}>
                {categoryIcons[category] || categoryIcons.Other}
              </div>
              <h3 className="text-lg font-semibold text-white">{category}</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  whileHover={{ scale: 1.02 }}
                  className="group relative p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white truncate" title={skill.name}>
                      {skill.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < Math.ceil(skill.proficiency / 20)
                              ? 'bg-indigo-400'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">{skill.proficiency}%</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}