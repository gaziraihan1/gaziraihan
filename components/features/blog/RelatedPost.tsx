// components/features/blog/related-posts.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface RelatedPostsProps {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    tags: Array<{ name: string; color: string }>;
  }>;
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Related Articles</h2>
        <p className="text-gray-400">Continue reading similar content</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag.name}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0.5"
                        style={{ borderColor: tag.color + '40', color: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-indigo-400 text-sm font-medium">
                    Read Article <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}