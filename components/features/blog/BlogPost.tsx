// components/features/blog/blog-post.tsx
'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogMarkdown } from './BlogMarkdown';
import Image from 'next/image';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    publishedAt: Date | null;
    thumbnail?: string | null;
    views: number;
    tags: Array<{ id: string; name: string; slug: string; color: string }>;
    author?: { name: string | null } | null;
  };
}

export function BlogPost({ post }: BlogPostProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <header className="mb-8">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              style={{ borderColor: tag.color + '40', color: tag.color }}
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag.name}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-400 mb-8 leading-relaxed">{post.excerpt}</p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-8 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{post.views} views</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.thumbnail && (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 mb-12">
          <Image
            src={post.thumbnail}
            alt={post.title}
            width={200}
            height={200}
            className="w-full h-full object-cover"
            fetchPriority='high'
            loading='lazy'
          />
        </div>
      )}

      {/* Content */}
      <BlogMarkdown content={post.content} />
    </motion.article>
  );
}