'use client';

import { motion } from 'framer-motion';
import { FolderOpen,  Eye, EyeOff, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { deleteProject, toggleProjectStatus } from '@/actions/adminProjects';

interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  status: string;
  featured: boolean;
  createdAt: Date;
  tags: Array<{ name: string }>;
}

export function RecentProjects({ projects }: { projects: Project[] }) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-400" />
            Recent Projects
          </CardTitle>
          <Link href="/admin/projects">
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No projects yet</p>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 5).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover"
                    fetchPriority='high'
                    loading='lazy'
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{project.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={project.status === 'LIVE' ? 'default' : 'secondary'}
                      className={`text-[10px] ${
                        project.status === 'LIVE'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : ''
                      }`}
                    >
                      {project.status}
                    </Badge>
                    {project.featured && (
                      <Badge variant="outline" className="text-[10px]">
                        Featured
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">{formatDate(project.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/projects/${project.slug}`} target="_blank">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleProjectStatus(project.id)}
                  >
                    {project.status === 'LIVE' ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300"
                    onClick={() => deleteProject(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}