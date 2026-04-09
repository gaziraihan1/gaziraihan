// app/(admin)/admin/blog/page.tsx
import { BlogTable } from '@/components/admin/BlogTable';
import { CreatePostButton } from '@/components/admin/CreatePostButton';
import { prisma } from '@/lib/prisma';

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    include: { tags: true, author: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog Posts</h1>
          <p className="text-gray-400">Manage your blog articles</p>
        </div>
        <CreatePostButton />
      </div>

      <BlogTable posts={posts} />
    </div>
  );
}