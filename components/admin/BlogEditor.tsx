'use client';

import { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';  // ✅ Import SubmitHandler
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { createBlogPost, updateBlogPost } from '@/actions/adminBlog';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string | null;
  published: boolean;  // ✅ Required boolean
  publishedAt?: Date | null;
  views: number;
  tags: Array<{ id: string; name: string; slug: string; color?: string }>;
  author?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  slug: z.string().min(5, 'Slug must be at least 5 characters').max(200),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters').max(500),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  thumbnail: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  published: z.boolean(),
  tags: z.array(z.string()),
});

type FormData = z.infer<typeof blogPostSchema>;

interface BlogEditorProps {
  post?: BlogPost | null;
  availableTags: Array<{ id: string; name: string; slug: string; color?: string }>;
}

export function BlogEditor({ post, availableTags }: BlogEditorProps) {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags?.map((t) => t.slug) || []
  );

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      thumbnail: post?.thumbnail || '',
      published: post?.published ?? false,
      tags: [],
    },
  });

  const content = watch('content');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const submitData = { 
        ...data, 
        tags: selectedTags,
      };
      
      let result;
      if (post) {
        result = await updateBlogPost(post.id, submitData);
      } else {
        result = await createBlogPost(submitData);
      }
      
      if (result?.success) {
        toast.success(post ? 'Post updated successfully!' : 'Post created successfully!');
        reset();
        router.push('/admin/blog');
        router.refresh();
      } else {
        toast.error(result?.error || 'Failed to save post');
      }
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error(error.message || 'An unexpected error occurred');
    }
  };

  const toggleTag = (tagSlug: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagSlug)
        ? prev.filter((t) => t !== tagSlug)
        : [...prev, tagSlug]
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className='space-y-2'>
            <Label className="text-gray-300">Title *</Label>
            <Input 
              {...register('title')} 
              className="bg-white/5 border-white/10 text-white" 
              placeholder="My Awesome Article" 
            />
            {errors.title && <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label className="text-gray-300">Slug *</Label>
            <Input 
              {...register('slug')} 
              className="bg-white/5 border-white/10 text-white" 
              placeholder="my-awesome-article" 
            />
            <p className="text-xs text-gray-500 mt-1">URL-friendly name (e.g., my-article)</p>
            {errors.slug && <p className="text-sm text-red-400 mt-1">{errors.slug.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label className="text-gray-300">Excerpt *</Label>
            <Textarea
              {...register('excerpt')}
              rows={3}
              className="bg-white/5 border-white/10 text-white resize-none"
              placeholder="Brief summary of your article..."
            />
            {errors.excerpt && <p className="text-sm text-red-400 mt-1">{errors.excerpt.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label className="text-gray-300">Thumbnail URL</Label>
            <Input 
              {...register('thumbnail')} 
              className="bg-white/5 border-white/10 text-white" 
              placeholder="https://..." 
            />
            {errors.thumbnail && <p className="text-sm text-red-400 mt-1">{errors.thumbnail.message}</p>}
          </div>

          <div className='space-y-2'>
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
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label className="text-gray-300 cursor-pointer">Publish immediately</Label>
          </div>
        </div>

        <div className='space-y-2'>
          <Label className="text-gray-300">Content (Markdown) *</Label>
          {isPreview ? (
            <Card className="bg-white/5 border-white/10 h-125 overflow-y-auto p-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray-300 text-sm font-mono">{content}</pre>
              </div>
            </Card>
          ) : (
            <Textarea
              {...register('content')}
              rows={25}
              className="bg-white/5 border-white/10 text-white font-mono text-sm resize-none"
              placeholder="# Write your article in Markdown...&#10;&#10;## Introduction&#10;Start your article here...&#10;&#10;```typescript&#10;// Code example&#10;```"
            />
          )}
          {errors.content && <p className="text-sm text-red-400 mt-2">{errors.content.message}</p>}
        </div>
      </div>
    </form>
  );
}