'use client';

import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, GitBranch } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail: string;
    featured: boolean;
    demoUrl?: string | null;
    repoUrl?: string | null;
    tags: Array<{ id: string; name: string; slug: string; color: string }>;
    metrics: Array<{ id: string; label: string; value: string }>;
  };
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            fetchPriority='high'
            loading='lazy'
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          
          {project.featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-indigo-500 text-white border-none">
                Featured
              </Badge>
            </div>
          )}

          <div className="absolute inset-0 bg-indigo-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            {project.demoUrl && (
              <Link
                href={project.demoUrl}
                className="p-3 rounded-full bg-white text-indigo-600 hover:scale-110 transition-transform"
              >
                <ExternalLink className="w-5 h-5" />
              </Link>
            )}
            {project.repoUrl && (
              <Link
                href={project.repoUrl}
                className="p-3 rounded-full bg-white text-indigo-600 hover:scale-110 transition-transform"
              >
                <GitBranch className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>

        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">{project.summary}</p>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-[10px] px-2 py-0.5"
                style={{ borderColor: tag.color + '40', color: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          {project.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {project.metrics.slice(0, 2).map((metric) => (
                <div
                  key={metric.id}
                  className="text-xs bg-white/5 rounded-lg p-2 text-center"
                >
                  <p className="text-indigo-400 font-semibold">{metric.value}</p>
                  <p className="text-gray-500">{metric.label}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-4 border-t border-white/10">
          <Button variant="ghost" size="sm" asChild className="w-full group/btn">
            <Link href={`/projects/${project.slug}`}>
              View Case Study
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}