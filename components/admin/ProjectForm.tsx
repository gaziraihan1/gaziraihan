// components/admin/ProjectForm.tsx
'use client';

import { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Eye, EyeOff, Save, Plus, X, Loader2, 
  Trash2, ArrowUp, ArrowDown, Star, StarOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { createProject, updateProject } from '@/actions/adminProjects';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  tags: Array<{ id: string; name: string; slug: string; color?: string }>;
  metrics: Array<{ id: string; label: string; value: string }>;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(200, 'Slug must be less than 200 characters'),
  summary: z.string().min(20, 'Summary must be at least 20 characters').max(500, 'Summary must be less than 500 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  thumbnail: z.string().url('Thumbnail must be a valid URL'),
  images: z.array(z.string().url('Each image must be a valid URL')).optional(),
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

type FormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project | null;
  availableTags: Array<{ id: string; name: string; slug: string; color?: string }>;
  mode?: 'create' | 'edit';
}

export function ProjectForm({ project, availableTags, mode = 'create' }: ProjectFormProps) {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Gallery state
  const [galleryImages, setGalleryImages] = useState<string[]>(
    project?.images || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageError, setImageError] = useState<string | null>(null);
  
  const [selectedTags, setSelectedTags] = useState<string[]>(
    project?.tags?.map((t) => t.slug) || []
  );
  const [metrics, setMetrics] = useState(
    project?.metrics?.length ? project.metrics : [{ id: '', label: '', value: '' }]
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
      demoUrl: project?.demoUrl ?? '',
      repoUrl: project?.repoUrl ?? '',
      featured: project?.featured ?? false,
      status: project?.status || 'LIVE',
      tags: [],
      metrics: [],
    },
  });

  const content = watch('description');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const submitData = { 
        ...data,
        demoUrl: data.demoUrl === '' ? null : data.demoUrl,
        repoUrl: data.repoUrl === '' ? null : data.repoUrl,
        tags: selectedTags,
        images: galleryImages,
        metrics: metrics.filter((m) => m.label.trim() && m.value.trim()).map(({ id, ...rest }) => rest),
      };
      
      let result;
      if (project && mode === 'edit') {
        result = await updateProject(project.id, submitData);
      } else {
        result = await createProject(submitData);
      }
      
      if (result?.success) {
        toast.success(mode === 'edit' ? 'Project updated successfully!' : 'Project created successfully!');
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

  // Gallery management functions
  const validateImageUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addGalleryImage = () => {
    if (!newImageUrl.trim()) return;
    
    if (!validateImageUrl(newImageUrl)) {
      setImageError('Please enter a valid image URL');
      return;
    }
    
    if (galleryImages.includes(newImageUrl)) {
      setImageError('This image is already in the gallery');
      return;
    }
    
    setGalleryImages([...galleryImages, newImageUrl]);
    setNewImageUrl('');
    setImageError(null);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...galleryImages];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newImages.length) return;
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setGalleryImages(newImages);
  };

  const addMetric = () => {
    setMetrics([...metrics, { id: '', label: '', value: '' }]);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const updateMetric = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: value };
    setMetrics(updated);
  };

  // Thumbnail preview
  const thumbnailUrl = watch('thumbnail');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        <div className="flex items-center gap-2">
          {project && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                reset();
                setGalleryImages(project.images || []);
                setSelectedTags(project.tags?.map(t => t.slug) || []);
                setMetrics(project.metrics?.length ? project.metrics : [{ id: '', label: '', value: '' }]);
                toast.info('Form reset to original values');
              }}
            >
              Reset Changes
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === 'edit' ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {mode === 'edit' ? 'Update Project' : 'Create Project'}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Form Fields */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            
            <div className='space-y-2'>
              <Label className="text-gray-300">Title *</Label>
              <Input 
                {...register('title')} 
                className="bg-white/5 border-white/10 text-white" 
                placeholder="My Awesome Project" 
              />
              {errors.title && <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>}
            </div>

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
          </Card>

          {/* Media */}
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h3 className="text-lg font-semibold text-white">Media</h3>
            
            {/* Thumbnail */}
            <div className="space-y-2">
              <Label className="text-gray-300">Thumbnail URL *</Label>
              <Input 
                {...register('thumbnail')} 
                className="bg-white/5 border-white/10 text-white" 
                placeholder="https://..." 
              />
              {errors.thumbnail && <p className="text-sm text-red-400 mt-1">{errors.thumbnail.message}</p>}
              
              {/* Thumbnail Preview */}
              {thumbnailUrl && validateImageUrl(thumbnailUrl) && (
                <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="space-y-2">
              <Label className="text-gray-300">Gallery Images</Label>
              
              {/* Add new image */}
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => {
                    setNewImageUrl(e.target.value);
                    setImageError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                  placeholder="https://example.com/image.jpg"
                  className="bg-white/5 border-white/10 text-white flex-1"
                />
                <Button type="button" onClick={addGalleryImage} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {imageError && <p className="text-sm text-red-400">{imageError}</p>}
              
              {/* Gallery Preview */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                  {galleryImages.map((url, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5">
                      <Image
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      
                      {/* Overlay controls */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-white hover:bg-white/20"
                          onClick={() => moveGalleryImage(index, 'up')}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-white hover:bg-white/20"
                          onClick={() => moveGalleryImage(index, 'down')}
                          disabled={index === galleryImages.length - 1}
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-400 hover:bg-red-500/20"
                          onClick={() => removeGalleryImage(index)}
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {/* Order indicator */}
                      <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Links */}
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h3 className="text-lg font-semibold text-white">Links</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </Card>

          {/* Tags & Status & Featured */}
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h3 className="text-lg font-semibold text-white">Classification</h3>
            
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

            {/* ✅ FIXED: Status dropdown with proper z-index */}
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
                    {/* ✅ FIXED: Trigger with proper styling */}
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2 relative z-0">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    {/* ✅ FIXED: Content with high z-index and proper positioning */}
                    <SelectContent 
                      className="z-9999 bg-[#0a0a0a] border-white/10"
                      position="popper"
                      sideOffset={4}
                    >
                      <SelectItem value="LIVE">Live</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-sm text-red-400 mt-1">{errors.status.message}</p>}
            </div>

            {/* ✅ FIXED: Featured Toggle Button (more prominent than Switch) */}
            <div className="pt-2 border-t border-white/10">
              <Label className="text-gray-300 mb-2 block">Visibility</Label>
              <Controller
                name="featured"
                control={control}
                render={({ field }) => (
                  <Button
                    type="button"
                    variant={field.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => field.onChange(!field.value)}
                    className={field.value 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500' 
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }
                  >
                    {field.value ? (
                      <>
                        <Star className="w-4 h-4 mr-2 fill-current" />
                        Featured
                      </>
                    ) : (
                      <>
                        <StarOff className="w-4 h-4 mr-2" />
                        Not Featured
                      </>
                    )}
                  </Button>
                )}
              />
              <p className="text-xs text-gray-500 mt-2">
                Featured projects appear prominently on the homepage
              </p>
            </div>
          </Card>

          {/* Metrics */}
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h3 className="text-lg font-semibold text-white">Key Metrics</h3>
            <div className="space-y-2">
              {metrics.map((metric, index) => (
                <div key={metric.id || index} className="flex items-center gap-2">
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
                    className="text-gray-400 hover:text-red-400 shrink-0"
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
          </Card>
        </div>

        {/* Right Column: Description */}
        <div className='space-y-2'>
          <Card className="p-6 bg-white/5 border-white/10 h-full">
            <Label className="text-gray-300 mb-4 block">Description (Markdown) *</Label>
            
            {isPreview ? (
              <div className="prose prose-invert prose-sm max-w-none h-150 overflow-y-auto pr-2">
                <div className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
                  {content || <span className="text-gray-500 italic">Start writing your description...</span>}
                </div>
              </div>
            ) : (
              <Textarea
                {...register('description')}
                rows={30}
                className="bg-white/5 border-white/10 text-white font-mono text-sm resize-none h-150"
                placeholder="# Write your project description in Markdown...&#10;&#10;## Features&#10;- Feature 1&#10;- Feature 2&#10;&#10;```typescript&#10;// Code example&#10;```"
              />
            )}
            {errors.description && <p className="text-sm text-red-400 mt-2">{errors.description.message}</p>}
            
            {/* Markdown help */}
            <details className="mt-4 text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-300">Markdown Tips</summary>
              <div className="mt-2 space-y-1 pl-4 border-l-2 border-white/10">
                <p><code className="bg-white/10 px-1 rounded"># Heading</code> for headings</p>
                <p><code className="bg-white/10 px-1 rounded">**bold**</code> and <code className="bg-white/10 px-1 rounded">*italic*</code></p>
                <p><code className="bg-white/10 px-1 rounded">- List items</code> for bullet points</p>
                <p><code className="bg-white/10 px-1 rounded">```lang</code> for code blocks</p>
              </div>
            </details>
          </Card>
        </div>
      </div>
    </form>
  );
}