'use client';

import { motion } from 'framer-motion';
import { ExternalLink, GitBranch } from 'lucide-react';
import { BentoCard } from '@/components/animations/BentoCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedProjectsCardProps {
  projects: Array<{
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail: string;
    tags: Array<{ name: string; color: string }>;
    demoUrl?: string | null;
    repoUrl?: string | null;
  }>;
}

export function FeaturedProjectsCard({ projects }: FeaturedProjectsCardProps) {
  if (projects.length === 0) {
    return (
      <div className="md:col-span-2 md:row-span-1">
        <BentoCard gradientColor="purple" className="h-full">
          <div className="flex flex-col justify-center items-center h-full p-6 text-center">
            <p className="text-gray-400 mb-4">Projects coming soon...</p>
            <Link href="/contact">
              <Button variant="outline" size="sm">Get in touch</Button>
            </Link>
          </div>
        </BentoCard>
      </div>
    );
  }

  return (
    <div className="md:col-span-2 md:row-span-1">
      <BentoCard gradientColor="purple" className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Featured Projects</h3>
            </div>
            <Link href="/projects">
              <Button variant="ghost" size="sm">View All →</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="relative h-32 overflow-hidden">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    loading='lazy'
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                </div>

                <div className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-2 truncate">
                    {project.title}
                  </h4>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag.name}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0.5"
                        style={{ borderColor: tag.color + '40', color: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {project.demoUrl && (
                      <Link
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    {project.repoUrl && (
                      <Link
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <GitBranch className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </BentoCard>
    </div>
  );
}

import { Code2 } from 'lucide-react';