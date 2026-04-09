// components/admin/admin-sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  Code2,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/skills', label: 'Skills', icon: Code2 },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // ✅ Detect screen size for responsive behavior
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    // Initial check
    checkDesktop();
    
    // Listen for resize
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // ✅ Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen && !isDesktop) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen, isDesktop]);

  // ✅ Close mobile menu when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setIsMobileOpen(false);
    }
  }, [isDesktop]);

  return (
    <>
      {/* Mobile Toggle Button - Only visible on mobile */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors md:hidden"
        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        // ✅ FIXED: Different animation for mobile vs desktop
        initial={isDesktop ? { x: 0 } : { x: -280 }}
        animate={{ 
          // Desktop: always visible at x: 0
          // Mobile: slide based on isMobileOpen
          x: isDesktop ? 0 : (isMobileOpen ? 0 : -280),
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        // ✅ FIXED: Proper responsive positioning
        className={cn(
          // Base styles
          "fixed md:static left-0 top-0 h-full md:h-auto w-64",
          "bg-[#0a0a0a] md:bg-white/5 border-r border-white/10 p-6",
          // Z-index: high on mobile (overlay), normal on desktop
          "z-40 md:z-auto",
          // Prevent overflow
          "overflow-y-auto overflow-x-hidden",
          // Desktop: always visible, no transform
          isDesktop ? "md:translate-x-0" : ""
        )}
      >
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-indigo-500/20">
            <Code2 className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-lg font-bold text-white">Admin Panel</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link 
                key={item.href} 
                href={item.href}
                // ✅ Close mobile menu when clicking nav item
                onClick={() => !isDesktop && setIsMobileOpen(false)}
                className="block"
              >
                <motion.div
                  whileHover={isDesktop ? { x: 4 } : undefined}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200',
                    isActive
                      ? 'bg-indigo-500/20 text-white border border-indigo-500/30 font-medium'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-indigo-400" : "text-white/80"
                  )} />
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 border-white/20 text-white hover:bg-white/10 hover:text-white"
            onClick={() => {
              setIsMobileOpen(false);
              signOut({ callbackUrl: '/admin/login' });
            }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Mobile Overlay - Only visible on mobile when sidebar is open */}
      <AnimatePresence>
        {isMobileOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}