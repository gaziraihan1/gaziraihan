import { BlogEditor } from '@/components/admin/BlogEditor';
import { prisma } from '@/lib/prisma';

export default async function NewBlogPostPage() {
  const availableTags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <a href="/admin/blog" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Blog
        </a>
        <div>
          <h1 className="text-3xl font-bold text-white">Create Blog Post</h1>
          <p className="text-gray-400">Write a new article for your blog</p>
        </div>
      </div>
      
      <BlogEditor availableTags={availableTags} />
    </div>
  );
}