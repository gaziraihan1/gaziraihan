// components/admin/messages-table.tsx
'use client';

import { useState } from 'react';
import { Mail, Eye, Trash2, Check, Archive, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { updateMessageStatus, deleteMessage } from '@/actions/adminMessage';

// ✅ FIXED: Interface matches Prisma ContactMessage model
interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;  // ← Nullable to match Prisma
  message: string;
  status: string;
  createdAt: Date;
  ipAddr: string | null;
  userAgent: string | null;
}

export function MessagesTable({ messages }: { messages: Message[] }) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.subject?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()); // ← Safe null handling
    
    const matchesStatus = statusFilter === 'all' || msg.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateMessageStatus(id, 'READ');
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await updateMessageStatus(id, 'ARCHIVED');
      toast.success('Message archived');
    } catch (error) {
      toast.error('Failed to archive message');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-gray-400">Sender</TableHead>
              <TableHead className="text-gray-400">Subject</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                  No messages found
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={`border-white/10 ${
                    msg.status === 'UNREAD' ? 'bg-indigo-500/5' : ''
                  }`}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{msg.name}</p>
                      <p className="text-xs text-gray-500">{msg.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    {/* ✅ Safe null handling for subject */}
                    {msg.subject || <span className="text-gray-500 italic">No subject</span>}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        msg.status === 'UNREAD'
                          ? 'default'
                          : msg.status === 'READ'
                          ? 'secondary'
                          : 'outline'
                      }
                      className={
                        msg.status === 'UNREAD'
                          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                          : ''
                      }
                    >
                      {msg.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {formatDate(msg.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedMessage(msg)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Message
                          </DropdownMenuItem>
                          {msg.status === 'UNREAD' && (
                            <DropdownMenuItem onClick={() => handleMarkAsRead(msg.id)}>
                              <Check className="w-4 h-4 mr-2" />
                              Mark as Read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleArchive(msg.id)}>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(msg.id)}
                            className="text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Message Detail Dialog */}
      {selectedMessage && (
        <Dialog open onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="bg-[#0a0a0a] border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {/* ✅ Safe null handling */}
                {selectedMessage.subject || 'No Subject'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  {selectedMessage.email}
                </div>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">{selectedMessage.name}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-500">{formatDate(selectedMessage.createdAt)}</span>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              {selectedMessage.ipAddr && (
                <p className="text-xs text-gray-500">IP: {selectedMessage.ipAddr}</p>
              )}
              <div className="flex gap-2 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}`;
                  }}
                >
                  Reply via Email
                </Button>
                {selectedMessage.status === 'UNREAD' && (
                  <Button onClick={() => {
                    handleMarkAsRead(selectedMessage.id);
                    setSelectedMessage(null);
                  }}>
                    Mark as Read
                  </Button>
                )}
                <Button variant="destructive" onClick={() => {
                  handleDelete(selectedMessage.id);
                  setSelectedMessage(null);
                }}>
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}