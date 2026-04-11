// components/admin/MessagesHeader.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Search,  RefreshCw, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MessagesHeaderProps {
  totalMessages: number;
  unreadCount: number;
  currentStatus?: string;
  currentSearch?: string;
}

export function MessagesHeader({ 
  totalMessages, 
  unreadCount, 
  currentStatus = 'all',
  currentSearch 
}: MessagesHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleSearch = (value: string) => {
    const params = new URLSearchParams();
    if (value) params.set('search', value);
    if (currentStatus && currentStatus !== 'all') params.set('status', currentStatus);
    params.set('page', '1'); // Reset to first page on search
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (status !== 'all') params.set('status', status);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handleRefresh = () => {
    router.refresh(); // ✅ Force fresh data from server
  };
  
  return (
    <div className="mb-8 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-400" />
            Messages
          </h1>
          <p className="text-gray-400 mt-1">
            {totalMessages} total • {unreadCount} unread
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="w-fit">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <Input
            placeholder="Search messages..."
            defaultValue={currentSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            aria-label="Search messages"
          />
        </div>
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={currentStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('all')}
            className="text-xs"
          >
            All
          </Button>
          <Button
            variant={currentStatus === 'UNREAD' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('UNREAD')}
            className="text-xs"
          >
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={currentStatus === 'READ' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('READ')}
            className="text-xs"
          >
            Read
          </Button>
          <Button
            variant={currentStatus === 'ARCHIVED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('ARCHIVED')}
            className="text-xs"
          >
            Archived
          </Button>
        </div>
      </div>
    </div>
  );
}