'use client';

import { useState } from 'react';
import { User } from 'next-auth';
import { Bell, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
  user: User;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur supports-backdrop-filter:bg-[#0a0a0a]/80">
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label={isSearchOpen ? 'Close search' : 'Open search'}
          >
            {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </Button>

          <div className="hidden md:block relative w-64 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {isSearchOpen && (
          <div className="absolute top-16 left-0 right-0 p-4 bg-[#0a0a0a] border-b border-white/10 md:hidden z-20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-white/5 border-white/10 text-white w-full"
                autoFocus
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-[#0a0a0a] border-white/10">
              <DropdownMenuItem className="text-white hover:bg-white/10">
                No new notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white truncate max-w-24 md:max-w-32">
                    {user.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-24 md:max-w-32">
                    {user.email}
                  </p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-indigo-400">
                    {user.name?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#0a0a0a] border-white/10">
              <DropdownMenuItem className="text-white hover:bg-white/10">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}