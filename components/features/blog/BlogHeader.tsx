// components/features/blog/blog-header.tsx
'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface BlogHeaderProps {
  totalPosts: number;
}

export function BlogHeader({ totalPosts }: BlogHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <FileText className="w-6 h-6 text-indigo-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">Blog</h1>
      </div>

      <p className="text-gray-400 text-lg max-w-2xl mb-6">
        Technical articles, tutorials, and insights on web development, UI/UX design,
        and software engineering. Learn from my experiences and best practices.
      </p>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>{totalPosts} Articles</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-gray-600" />
        <span>Updated Regularly</span>
      </div>
    </motion.div>
  );
}