'use client';

import { motion } from 'framer-motion';
import { Mail,  Check, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { updateMessageStatus, deleteMessage } from '@/actions/adminMessage';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  status: string;
  createdAt: Date;
}

export function RecentMessages({ messages }: { messages: Message[] }) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
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
                    onClick={() => updateMessageStatus(msg.id, 'READ')}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300"
                    onClick={() => deleteMessage(msg.id)}
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
  );
}