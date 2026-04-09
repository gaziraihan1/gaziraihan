// components/admin/project-form.tsx
'use client';

import { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Save, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
// ✅ FIXED: kebab-case import
import { createProject, updateProject } from '@/actions/adminProjects';
import { useRouter } from 'next/navigation';

// ✅ Project type definition (for display/editing existing projects)
export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  thumbnail: string;
  images?: string[];
  demoUrl?: string | null;
  repoUrl?: string | null;
  featured: boolean;
  status: 'LIVE' | 'ARCHIVED' | 'IN_PROGRESS';
  tags: Array<{ id: string; name: string; slug: string }>;
  metrics: Array<{ id: string; label: string; value: string }>;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Validation schema (server-side)
const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(200, 'Slug must be less than 200 characters'),
  summary: z.string().min(20, 'Summary must be at least 20 characters').max(500, 'Summary must be less than 500 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  thumbnail: z.string().url('Thumbnail must be a valid URL'),
  images: z.array(z.string().url('Each image must be a valid URL')).optional(),
  // ✅ FIXED: Use .nullable() to allow null values
  demoUrl: z.string().url('Demo URL must be a valid URL').nullable().optional().or(z.literal('')),
  repoUrl: z.string().url('Repo URL must be a valid URL').nullable().optional().or(z.literal('')),
  featured: z.boolean(),
  status: z.enum(['LIVE', 'ARCHIVED', 'IN_PROGRESS']),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')),
  metrics: z.array(z.object({
    label: z.string().min(1, 'Metric label cannot be empty'),
    value: z.string().min(1, 'Metric value cannot be empty'),
  })).optional(),
});

// ✅ FIXED: Use Zod-inferred type for form (avoids null/undefined mismatch)
type FormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project | null;
  availableTags: Array<{ id: string; name: string; slug: string; color?: string }>;
}

export function ProjectForm({ project, availableTags }: ProjectFormProps) {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedTags, setSelectedTags] = useState<string[]>(
    project?.tags?.map((t) => t.slug) || []
  );
  const [metrics, setMetrics] = useState(
    project?.metrics?.length ? project.metrics : [{ label: '', value: '' }]
  );

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      slug: project?.slug || '',
      summary: project?.summary || '',
      description: project?.description || '',
      thumbnail: project?.thumbnail || '',
      images: project?.images || [],
      // ✅ FIXED: Handle null values properly
      demoUrl: project?.demoUrl ?? '',
      repoUrl: project?.repoUrl ?? '',
      featured: project?.featured ?? false,
      status: project?.status || 'LIVE',
      tags: [],
      metrics: [],
    },
  });

  const content = watch('description');

  // ✅ FIXED: Use FormData type (Zod-inferred) for submit handler
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // ✅ Transform form data to match server action input
      const submitData = { 
        ...data,
        // Convert empty strings to null for URL fields
        demoUrl: data.demoUrl === '' ? null : data.demoUrl,
        repoUrl: data.repoUrl === '' ? null : data.repoUrl,
        tags: selectedTags,
        metrics: metrics.filter((m) => m.label.trim() && m.value.trim()),
      };
      
      let result;
      if (project) {
        result = await updateProject(project.id, submitData);
      } else {
        result = await createProject(submitData);
      }
      
      if (result?.success) {
        toast.success(project ? 'Project updated successfully!' : 'Project created successfully!');
        reset();
        router.push('/admin/projects');
        router.refresh();
      } else {
        toast.error(result?.error || 'Failed to save project');
      }
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tagSlug: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagSlug)
        ? prev.filter((t) => t !== tagSlug)
        : [...prev, tagSlug]
    );
  };

  const addMetric = () => {
    setMetrics([...metrics, { label: '', value: '' }]);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const updateMetric = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: value };
    setMetrics(updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={isPreview ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {project ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {project ? 'Update Project' : 'Create Project'}
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Fields */}
        <div className="space-y-4">
          {/* Title */}
          <div className='space-y-2'>
            <Label className="text-gray-300">Title *</Label>
            <Input 
              {...register('title')} 
              className="bg-white/5 border-white/10 text-white" 
              placeholder="My Awesome Project" 
            />
            {errors.title && <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label className="text-gray-300">Slug *</Label>
            <Input 
              {...register('slug')} 
              className="bg-white/5 border-white/10 text-white" 
              placeholder="my-awesome-project" 
            />
            <p className="text-xs text-gray-500 mt-1">URL-friendly name (e.g., my-project)</p>
            {errors.slug && <p className="text-sm text-red-400 mt-1">{errors.slug.message}</p>}
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label className="text-gray-300">Summary *</Label>
            <Textarea
              {...register('summary')}
              rows={3}
              className="bg-white/5 border-white/10 text-white resize-none"
              placeholder="Brief description of your project..."
            />
            {errors.summary && <p className="text-sm text-red-400 mt-1">{errors.summary.message}</p>}
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label className="text-gray-300">Thumbnail URL *</Label>
            <Input 
              {...register('thumbnail')} 
              className="bg-white/5 border-white/10 text-white" 
              placeholder="https://..." 
            />
            {errors.thumbnail && <p className="text-sm text-red-400 mt-1">{errors.thumbnail.message}</p>}
          </div>

          {/* Demo & Repo URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Demo URL</Label>
              <Input 
                {...register('demoUrl')} 
                className="bg-white/5 border-white/10 text-white" 
                placeholder="https://demo.com" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Repo URL</Label>
              <Input 
                {...register('repoUrl')} 
                className="bg-white/5 border-white/10 text-white" 
                placeholder="https://github.com/..." 
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-gray-300">Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.slug) ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors"
                  style={
                    selectedTags.includes(tag.slug) && tag.color
                      ? { backgroundColor: tag.color, borderColor: tag.color }
                      : tag.color ? { borderColor: tag.color + '40', color: tag.color } : {}
                  }
                  onClick={() => toggleTag(tag.slug)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
            {errors.tags && <p className="text-sm text-red-400 mt-1">{errors.tags.message}</p>}
          </div>

          {/* Status - Using Controller for shadcn/ui Select */}
          <div className="space-y-2">
            <Label className="text-gray-300">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LIVE">Live</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <p className="text-sm text-red-400 mt-1">{errors.status.message}</p>}
          </div>

          {/* Featured Switch - Using Controller */}
          <div className="space-y-2">
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label className="text-gray-300 cursor-pointer">Featured on homepage</Label>
          </div>

          {/* Metrics */}
          <div>
            <Label className="text-gray-300">Key Metrics</Label>
            <div className="space-y-2 mt-2">
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Label (e.g., Performance)"
                    value={metric.label}
                    onChange={(e) => updateMetric(index, 'label', e.target.value)}
                    className="bg-white/5 border-white/10 text-white flex-1"
                  />
                  <Input
                    placeholder="Value (e.g., +40%)"
                    value={metric.value}
                    onChange={(e) => updateMetric(index, 'value', e.target.value)}
                    className="bg-white/5 border-white/10 text-white flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMetric(index)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addMetric}>
                <Plus className="w-4 h-4 mr-2" />
                Add Metric
              </Button>
            </div>
            {errors.metrics && <p className="text-sm text-red-400 mt-1">{errors.metrics.message}</p>}
          </div>
        </div>

        {/* Content Editor / Preview */}
        <div className='space-y-2'>
          <Label className="text-gray-300">Description (Markdown) *</Label>
          {isPreview ? (
            <Card className="bg-white/5 border-white/10 h-125 overflow-y-auto p-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray-300 text-sm font-mono">{content}</pre>
              </div>
            </Card>
          ) : (
            <Textarea
              {...register('description')}
              rows={25}
              className="bg-white/5 border-white/10 text-white font-mono text-sm resize-none"
              placeholder="# Write your project description in Markdown...&#10;&#10;## Features&#10;- Feature 1&#10;- Feature 2&#10;&#10;```typescript&#10;// Code example&#10;```"
            />
          )}
          {errors.description && <p className="text-sm text-red-400 mt-2">{errors.description.message}</p>}
        </div>
      </div>
    </form>
  );
}