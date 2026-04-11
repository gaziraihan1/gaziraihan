'use client';

import { useState } from 'react';
import { Edit, Trash2, ExternalLink, Eye, EyeOff, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { deleteProject, toggleProjectStatus } from '@/actions/adminProjects';
import { toast } from 'sonner';

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

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      toast.success('Project deleted successfully');
      setDeleteDialog(null);
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleProjectStatus(id);
      toast.success('Project status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
        >
          <option value="all">All Status</option>
          <option value="live">Live</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="rounded-lg border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-gray-400">Project</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Tags</TableHead>
              <TableHead className="text-gray-400">Created</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                  No projects found
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id} className="border-white/10">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={project.thumbnail}
                          alt={project.title}
                          fill
                          className="object-cover"
                          priority
                          loading='lazy'
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{project.title}</p>
                        <p className="text-xs text-gray-500">{project.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={project.status === 'LIVE' ? 'default' : 'secondary'}
                        className={
                          project.status === 'LIVE'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : ''
                        }
                      >
                        {project.status}
                      </Badge>
                      {project.featured && (
                        <Badge variant="outline" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap max-w-50">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag.name} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/projects/${project.slug}`} target="_blank">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Public
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(project.id)}>
                            {project.status === 'LIVE' ? (
                              <EyeOff className="w-4 h-4 mr-2" />
                            ) : (
                              <Eye className="w-4 h-4 mr-2" />
                            )}
                            {project.status === 'LIVE' ? 'Archive' : 'Publish'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteDialog(project.id)}
                            className="text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="bg-[#0a0a0a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}