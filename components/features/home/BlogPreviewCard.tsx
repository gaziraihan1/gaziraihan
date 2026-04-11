// components/features/home/blog-preview-card.tsx
'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { BentoCard } from '@/components/animations/BentoCard';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface BlogPreviewCardProps {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: Date | null;
    tags: Array<{ name: string; color: string }>;
  }>;
}

export function BlogPreviewCard({ posts }: BlogPreviewCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="md:col-span-1 md:row-span-1">
      <BentoCard gradientColor="purple" className="h-full">
        <div className="flex flex-col h-full p-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Latest Posts</h3>
            </div>
            <Link href="/blog">
              <span className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                View All →
              </span>
            </Link>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {posts.length === 0 ? (
              <p className="text-gray-400 text-sm">No posts yet</p>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <h4 className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors mb-1 line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">{formatDate(post.publishedAt)}</span>
                      {post.tags.length > 0 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                          {post.tags[0].name}
                        </Badge>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </BentoCard>
    </div>
  );
}