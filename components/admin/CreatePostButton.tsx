// components/admin/create-post-button.tsx
'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CreatePostButton() {
  return (
    <Button asChild>
      <Link href="/admin/blog/new">
        <Plus className="w-4 h-4 mr-2" />
        Create Post
      </Link>
    </Button>
  );
}