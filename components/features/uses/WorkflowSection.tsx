// components/features/uses/WorkflowSection.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle, GitBranch, Terminal, Zap } from 'lucide-react';

interface WorkflowSectionProps {
  workflow: Array<{ title: string; description: string; icon?: string }>;
}

export function WorkflowSection({ workflow }: WorkflowSectionProps) {
  if (workflow.length === 0) return null;

  const icons: Record<string, React.ReactNode> = {
    git: <GitBranch className="w-5 h-5 text-indigo-400" />,
    terminal: <Terminal className="w-5 h-5 text-indigo-400" />,
    automation: <Zap className="w-5 h-5 text-indigo-400" />,
    process: <CheckCircle className="w-5 h-5 text-indigo-400" />,
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <GitBranch className="w-6 h-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Development Workflow</h2>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {workflow.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-start gap-3">
              {icons[item.icon || 'process']}
              <div>
                <h4 className="font-medium text-white">{item.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}