import { Suspense } from "react";
import { Metadata } from "next";
import { getAdminMessages } from "@/actions/adminMessage";
import { MessagesTable } from "@/components/admin/MessageTable";
import { MessagesHeader } from "@/components/admin/MessageHeader";
import { MessagesSkeleton } from "@/components/admin/MessagesSkeleton";

export const metadata: Metadata = {
  title: "Messages | Admin",
  description: "Manage contact form submissions and user messages.",
};

export const revalidate = 300; // 5 minutes

interface MessagesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: "all" | "UNREAD" | "READ" | "ARCHIVED";
  }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search;
  const status = params.status;
  
  const { messages, pagination } = await getAdminMessages({
    page,
    limit: 20,
    search,
    status,
  });
  
  const unreadCount = messages.filter(m => m.status === "UNREAD").length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <MessagesHeader 
        totalMessages={pagination.totalMessages}
        unreadCount={unreadCount}
        currentStatus={status}
        currentSearch={search}
      />
      
      {/* ✅ Stream table with Suspense for better UX */}
      <Suspense fallback={<MessagesSkeleton />}>
        <MessagesTable
          messages={messages}
          pagination={pagination}
          currentParams={{ page: page.toString(), search, status }}
        />
      </Suspense>
    </div>
  );
}