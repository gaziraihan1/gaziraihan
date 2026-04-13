// app/(admin)/admin/blog/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// ✅ FIXED: params is a Promise in Next.js 16+
interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  // ✅ FIXED: Await params to get the actual id
  const { id } = await params;
  
  // ✅ Validate id before querying
  if (!id) {
    console.error('❌ Blog post id is missing');
    notFound();
  }

  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { tags: true, author: true },
  });

  if (!post) {
    console.warn(`⚠️ Blog post not found: ${id}`);
    notFound();
  }

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
          <p className="text-gray-400">Update your article: {post.title}</p>
        </div>
      </div>
      
      <BlogEditor post={post} availableTags={availableTags} />
    </div>
  );
}