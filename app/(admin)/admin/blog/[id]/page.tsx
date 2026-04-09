// app/(admin)/admin/blog/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.id },
    include: { tags: true, author: true },
  });

  if (!post) notFound();

  const availableTags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Blog
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Blog Post</h1>
          <p className="text-gray-400">Update your article</p>
        </div>
      </div>
      
      <BlogEditor post={post} availableTags={availableTags} />
    </div>
  );
}