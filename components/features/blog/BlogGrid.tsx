import { BlogCard } from './BlogCard';

interface BlogGridProps {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: Date | null;
    thumbnail?: string | null;
    tags: Array<{ id: string; name: string; slug: string; color: string }>;
    author?: { name: string | null } | null;
  }>;
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}