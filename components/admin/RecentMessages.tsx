// components/admin/RecentMessages.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, Trash2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateMessageStatus, deleteMessage } from '@/actions/adminMessage';
import { toast } from 'sonner';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  status: string;
  createdAt: Date;
}

interface RecentMessagesProps {
  messages: Message[];
}

export function RecentMessages({ messages }: RecentMessagesProps) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateMessageStatus(id, 'READ');
      // ✅ Optimistic UI: Refresh to show updated status
      router.refresh();
      toast.success('Message marked as read');
    } catch {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog || isDeleting) return;
    
    setIsDeleting(true);
    
    try {
      await deleteMessage(deleteDialog);
      // ✅ Optimistic UI: Remove from list immediately
      router.refresh();
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    } finally {
      setIsDeleting(false);
      setDeleteDialog(null);
    }
  };

  return (
    <>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-400" />
              Recent Messages
            </CardTitle>
            <Link href="/admin/messages">
              <Button variant="ghost" size="sm">View All →</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 5).map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white truncate">{msg.name}</p>
                      <Badge
                        variant={msg.status === 'UNREAD' ? 'default' : 'secondary'}
                        className={`text-[10px] ${
                          msg.status === 'UNREAD'
                            ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                            : ''
                        }`}
                      >
                        {msg.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-500">{formatDate(msg.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleMarkAsRead(msg.id)}
                      title="Mark as read"
                      disabled={msg.status === 'READ'}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300"
                      onClick={() => setDeleteDialog(msg.id)}
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ✅ Delete Confirmation Modal */}
      <Dialog open={!!deleteDialog} onOpenChange={() => !isDeleting && setDeleteDialog(null)}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              Delete Message
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="min-w-25"
            >
              {isDeleting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}