// components/admin/ProjectsTable.tsx
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
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            aria-label="Search projects"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="LIVE">Live</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* ✅ FIXED: Table container with overflow-y-visible for dropdowns */}
      <div className="rounded-lg border border-white/10 overflow-x-auto overflow-y-visible">
        <Table className="min-w-200">
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-gray-400 whitespace-nowrap">Project</TableHead>
              <TableHead className="text-gray-400 whitespace-nowrap">Status</TableHead>
              <TableHead className="text-gray-400 whitespace-nowrap hidden md:table-cell">Tags</TableHead>
              <TableHead className="text-gray-400 whitespace-nowrap hidden lg:table-cell">Created</TableHead>
              {/* ✅ FIXED: Actions column with proper z-index context */}
              <TableHead className="text-gray-400 text-right whitespace-nowrap relative z-0">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Edit className="w-10 h-10 text-gray-600" />
                    <p className="text-lg">No projects found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className="border-white/10 hover:bg-white/5 transition-colors group"
                >
                  {/* Project Column */}
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5">
                        <Image
                          src={project.thumbnail}
                          alt={project.title}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate" title={project.title}>
                          {project.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{project.slug}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Status Column */}
                  <TableCell className="align-middle">
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
                          ★
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Tags Column (Desktop) */}
                  <TableCell className="align-middle hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-40">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag.name} variant="outline" className="text-xs px-1.5 py-0">
                          {tag.name}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Created Column (Desktop) */}
                  <TableCell className="text-gray-400 align-middle hidden lg:table-cell">
                    {new Date(project.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>


<TableCell className="text-right">
  <div className="flex items-center justify-end gap-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      {/* ✅ ONLY CHANGE THIS - Add z-index and background */}
      <DropdownMenuContent 
        align="end" 
        className="z-9999 bg-[#0a0a0a] border-white/10"
      >
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 max-w-md">
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