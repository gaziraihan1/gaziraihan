'use client';

import { motion } from 'framer-motion';
import { Code2, FolderOpen } from 'lucide-react';

interface ProjectsHeaderProps {
  totalProjects: number;
}

export function ProjectsHeader({ totalProjects }: ProjectsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <FolderOpen className="w-6 h-6 text-indigo-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">Projects</h1>
      </div>

      <p className="text-gray-400 text-lg max-w-2xl mb-6">
        Explore my portfolio of web applications, UI/UX designs, and full-stack
        projects built with modern technologies. Each project includes detailed
        case studies with challenges, solutions, and outcomes.
      </p>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          <span>{totalProjects} Projects</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-gray-600" />
        <span>Full-Stack • Frontend • UI/UX</span>
      </div>
    </motion.div>
  );
}