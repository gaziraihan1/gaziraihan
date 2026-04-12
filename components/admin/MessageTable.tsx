'use client';

import { useState, useEffect } from 'react';
import { Mail, Eye, Trash2, Check, Archive, Search, MoreVertical } from 'lucide-react';
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
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { AdminMessage } from '@/actions/adminMessage';
import { updateMessageStatus, deleteMessage } from '@/actions/adminMessage';

interface MessagesTableProps {
  messages: AdminMessage[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  currentParams: {
    page: string;
    search?: string;
    status?: string;
  };
}

export function MessagesTable({ messages, pagination, currentParams }: MessagesTableProps) {
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.subject?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || msg.status.toLowerCase() === statusFilter.toLowerCase();
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
      timeZone: 'UTC', // ✅ Force UTC to match server
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            aria-label="Search messages"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="UNREAD">Unread</option>
          <option value="READ">Read</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="rounded-lg border border-white/10 overflow-x-auto overflow-y-visible">
        <Table className="min-w-175">
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-gray-400 whitespace-nowrap">Sender</TableHead>
              <TableHead className="text-gray-400 whitespace-nowrap">Subject</TableHead>
              <TableHead className="text-gray-400 whitespace-nowrap">Status</TableHead>
              <TableHead className="text-gray-400 whitespace-nowrap">Date</TableHead>
              <TableHead className="text-gray-400 text-right whitespace-nowrap relative z-0">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Mail className="w-10 h-10 text-gray-600" />
                    <p className="text-lg">No messages found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={`border-white/10 hover:bg-white/5 transition-colors ${
                    msg.status === 'UNREAD' ? 'bg-indigo-500/5' : ''
                  }`}
                >
                  <TableCell className="align-top">
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{msg.name}</p>
                      <p className="text-xs text-gray-500 truncate">{msg.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="text-white truncate max-w-48" title={msg.subject || ''}>
                      {msg.subject || <span className="text-gray-500 italic">No subject</span>}
                    </p>
                  </TableCell>
                  <TableCell className="align-top">
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
                      {msg.status.charAt(0) + msg.status.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400 whitespace-nowrap align-top">
                    {formatDate(msg.createdAt)}
                  </TableCell>
                  <TableCell className="text-right align-top relative">
                    <div className="flex items-center justify-end gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="relative z-10 hover:bg-white/10"
                            aria-label="Message actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="z-100 bg-[#0a0a0a] border-white/10"
                          sideOffset={4}
                          suppressHydrationWarning
                        >
                          <DropdownMenuItem 
                            onClick={() => setSelectedMessage(msg)}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Message
                          </DropdownMenuItem>
                          {msg.status === 'UNREAD' && (
                            <DropdownMenuItem 
                              onClick={() => handleMarkAsRead(msg.id)}
                              className="cursor-pointer"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Mark as Read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleArchive(msg.id)}
                            className="cursor-pointer"
                          >
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(msg.id)}
                            className="text-red-400 cursor-pointer"
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

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalMessages} messages
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const params = new URLSearchParams(currentParams);
                params.set('page', (pagination.currentPage - 1).toString());
                window.location.search = params.toString();
              }}
              disabled={!pagination.hasPrevPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const params = new URLSearchParams(currentParams);
                params.set('page', (pagination.currentPage + 1).toString());
                window.location.search = params.toString();
              }}
              disabled={!pagination.hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {selectedMessage && (
        <Dialog open onOpenChange={() => setSelectedMessage(null)} >
          <DialogContent className="bg-[#0a0a0a] border-white/10 max-w-2xl px-4 mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedMessage.subject || 'No Subject'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Message from {selectedMessage.name} ({selectedMessage.email})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-sm pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <a 
                    href={`mailto:${selectedMessage.email}`}
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">{selectedMessage.name}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-500">{formatDate(selectedMessage.createdAt)}</span>
                <Badge 
                  variant={selectedMessage.status === 'UNREAD' ? 'default' : 'secondary'}
                  className={selectedMessage.status === 'UNREAD' ? 'bg-indigo-500/20 text-indigo-400' : ''}
                >
                  {selectedMessage.status}
                </Badge>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
              
              {(selectedMessage.ipAddr || selectedMessage.userAgent) && (
                <details className="text-xs text-gray-500">
                  <summary className="cursor-pointer hover:text-gray-300 transition-colors">
                    Technical Details
                  </summary>
                  <div className="mt-2 space-y-1 pl-4 border-l-2 border-white/10">
                    {selectedMessage.ipAddr && <p>IP: {selectedMessage.ipAddr}</p>}
                    {selectedMessage.userAgent && (
                      <p className="truncate" title={selectedMessage.userAgent}>
                        User Agent: {selectedMessage.userAgent}
                      </p>
                    )}
                  </div>
                </details>
              )}
              
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || '')}`;
                  }}
                >
                  Reply via Email
                </Button>
                {selectedMessage.status === 'UNREAD' && (
                  <Button 
                    size="sm"
                    onClick={() => {
                      handleMarkAsRead(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                  >
                    Mark as Read
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this message?')) {
                      handleDelete(selectedMessage.id);
                      setSelectedMessage(null);
                    }
                  }}
                >
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