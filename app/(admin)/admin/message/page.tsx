// app/(admin)/admin/messages/page.tsx
import { MessagesTable } from '@/components/admin/MessageTable';
import { prisma } from '@/lib/prisma';

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
        <p className="text-gray-400">View and manage contact form submissions</p>
      </div>

      <MessagesTable messages={messages} />
    </div>
  );
}