// components/features/projects/project-navigation.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NavProject {
  slug: string;
  title: string;
  thumbnail: string;
}

export function ProjectNavigation({
  previous,
  next,
}: {
  previous: NavProject | null;
  next: NavProject | null;
}) {
  if (!previous && !next) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-12">
      {previous && (
        <Link href={`/projects/${previous.slug}`} className="group">
          <motion.div
            whileHover={{ x: -5 }}
            className="flex items-center gap-4"
          >
            <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0">
              <Image
                src={previous.thumbnail}
                alt={previous.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <ArrowLeft className="w-4 h-4" />
                Previous Project
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                {previous.title}
              </h3>
            </div>
          </motion.div>
        </Link>
      )}
      
      {next && (
        <Link href={`/projects/${next.slug}`} className="group md:text-right md:col-start-2">
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center justify-end gap-4"
          >
            <div>
              <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mb-1">
                Next Project
                <ArrowRight className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                {next.title}
              </h3>
            </div>
            <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0">
              <Image
                src={next.thumbnail}
                alt={next.title}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </Link>
      )}
    </div>
  );
}