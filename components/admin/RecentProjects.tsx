'use client';

import { motion } from 'framer-motion';
import { FolderOpen, Eye, EyeOff, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
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

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await toggleProjectStatus(id);
      toast.success(`Project ${currentStatus === 'LIVE' ? 'unpublished' : 'published'}`);
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      await deleteProject(id);
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
    }
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
            <Button variant="ghost" size="sm" className="text-xs">
              View All →
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No projects yet</p>
            <Link href="/admin/projects/new">
              <Button variant="outline" size="sm" className="mt-4">
                Create First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 overflow-x-auto">
            <Table className="min-w-150">
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-400 whitespace-nowrap w-12">
                    <span className="sr-only">Thumbnail</span>
                  </TableHead>
                  <TableHead className="text-gray-400 whitespace-nowrap">Project</TableHead>
                  <TableHead className="text-gray-400 whitespace-nowrap hidden sm:table-cell">Tags</TableHead>
                  <TableHead className="text-gray-400 whitespace-nowrap">Status</TableHead>
                  <TableHead className="text-gray-400 whitespace-nowrap hidden md:table-cell">Created</TableHead>
                  <TableHead className="text-gray-400 text-right whitespace-nowrap relative z-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.slice(0, 5).map((project, index) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-white/10 hover:bg-white/5 transition-colors group"
                  >
                    <TableCell className="align-middle">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={project.thumbnail}
                          alt={project.title}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="align-middle">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate" title={project.title}>
                          {project.title}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1 sm:hidden">
                          {project.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag.name} variant="outline" className="text-[10px] px-1.5 py-0">
                              {tag.name}
                            </Badge>
                          ))}
                          {project.tags.length > 2 && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              +{project.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="align-middle hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-32">
                        {project.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag.name} variant="outline" className="text-[10px] px-1.5 py-0">
                            {tag.name}
                          </Badge>
                        ))}
                        {project.tags.length > 2 && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            +{project.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="align-middle">
                      <div className="flex items-center gap-2">
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
                            ★
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-gray-400 text-sm align-middle hidden md:table-cell">
                      {formatDate(project.createdAt)}
                    </TableCell>

                    <TableCell className="text-right align-middle relative">
                      <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 relative z-10 hover:bg-white/10"
                              aria-label={`Actions for ${project.title}`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="z-100 bg-[#0a0a0a] border-white/10"
                            sideOffset={4}
                          >
                            <DropdownMenuItem asChild>
                              <Link 
                                href={`/projects/${project.slug}`} 
                                target="_blank"
                                className="cursor-pointer"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Public
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link 
                                href={`/admin/projects/${project.id}`}
                                className="cursor-pointer"
                              >
                                <FolderOpen className="w-4 h-4 mr-2" />
                                Edit Project
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(project.id, project.status)}
                              className="cursor-pointer"
                            >
                              {project.status === 'LIVE' ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(project.id, project.title)}
                              className="text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}