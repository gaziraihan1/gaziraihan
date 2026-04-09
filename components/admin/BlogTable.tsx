// components/admin/blog-table.tsx
'use client';

import { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
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
import { toast } from 'sonner';
import { deleteBlogPost, toggleBlogPostPublish } from '@/actions/adminBlog'; // ✅ Fixed: kebab-case

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail?: string | null;
  published: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  tags: Array<{ id: string; name: string; slug: string; color?: string }>;
  author?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

export function BlogTable({ posts }: { posts: BlogPost[] }) {
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'published' && post.published) ||
      (statusFilter === 'draft' && !post.published);
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteBlogPost(id);
      toast.success('Blog post deleted successfully');
      setDeleteDialog(null);
    } catch (error) {
      toast.error('Failed to delete blog post');
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await toggleBlogPostPublish(id);
      toast.success('Post status updated');
    } catch (error) {
      toast.error('Failed to update post status');
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search posts..."
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
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* ✅ FIXED: Table container with overflow-visible for dropdowns */}
      <div className="rounded-lg border border-white/10 overflow-visible">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-gray-400">Post</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Tags</TableHead>
              <TableHead className="text-gray-400">Author</TableHead>
              <TableHead className="text-gray-400">Views</TableHead>
              <TableHead className="text-gray-400">Published</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                  No posts found
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id} className="border-white/10">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {post.thumbnail && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate max-w-48">{post.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-48">{post.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={post.published ? 'default' : 'secondary'}
                      className={
                        post.published
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap max-w-32">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge 
                          key={tag.id} 
                          variant="outline" 
                          className="text-xs"
                          style={tag.color ? { borderColor: tag.color + '40', color: tag.color } : {}}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    <div className="min-w-0">
                      <p className="text-white truncate max-w-24">{post.author?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 truncate max-w-24">{post.author?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">{post.views.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-400">{formatDate(post.publishedAt)}</TableCell>
                  
                  {/* ✅ FIXED: Actions cell with proper z-index stacking */}
                  <TableCell className="text-right relative">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="relative z-10">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        {/* ✅ FIXED: Dropdown content with high z-index and portal */}
                        <DropdownMenuContent 
                          align="end" 
                          className="z-100 bg-[#0a0a0a] border-white/10"
                          sideOffset={4}
                        >
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/blog/${post.id}`} className="cursor-pointer">Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${post.slug}`} target="_blank" className="cursor-pointer">
                              <Eye className="w-4 h-4 mr-2" />
                              View Public
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleTogglePublish(post.id)}
                            className="cursor-pointer"
                          >
                            {post.published ? (
                              <EyeOff className="w-4 h-4 mr-2" />
                            ) : (
                              <Eye className="w-4 h-4 mr-2" />
                            )}
                            {post.published ? 'Unpublish' : 'Publish'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteDialog(post.id)}
                            className="text-red-400 cursor-pointer"
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
        <DialogContent className="bg-[#0a0a0a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Blog Post</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this post? This action cannot be undone.
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