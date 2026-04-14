'use client';

import { motion } from 'framer-motion';
import { Code2, Cpu, BookOpen, Sparkles } from 'lucide-react';

export function UsesHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm">
        <Sparkles className="w-4 h-4" />
        Updated January 2026
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
        Tools & Setup I Use to Build
      </h1>
      
      <p className="text-xl text-gray-400 max-w-2xl mx-auto">
        A curated list of the hardware, software, and workflows that power my development process 
        and help me ship quality products.
      </p>
      
      {/* Quick Stats */}
      <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-white/10">
        <div className="text-center">
          <Code2 className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">50+</p>
          <p className="text-sm text-gray-500">Technologies</p>
        </div>
        <div className="text-center">
          <Cpu className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">15+</p>
          <p className="text-sm text-gray-500">Tools & Apps</p>
        </div>
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">10+</p>
          <p className="text-sm text-gray-500">Learning Resources</p>
        </div>
      </div>
    </motion.section>
  );
}