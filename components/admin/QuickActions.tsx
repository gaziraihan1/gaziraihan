'use client';

import { motion } from 'framer-motion';
import { MessageSquare, FolderOpen, FileText, Settings, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const actions = [
  {
    title: 'New Project',
    description: 'Add a project to your portfolio',
    icon: FolderOpen,
    href: '/admin/projects/new',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    title: 'New Blog Post',
    description: 'Write a new article',
    icon: FileText,
    href: '/admin/blog/new',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    title: 'View Messages',
    description: 'Check contact submissions',
    icon: MessageSquare,
    href: '/admin/messages',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    title: 'Settings',
    description: 'Configure site settings',
    icon: Settings,
    href: '/admin/settings',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
];

export function QuickActions() {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group">
                    <div className={`p-3 rounded-lg ${action.bg} w-fit mb-3`}>
                      <Icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-400">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}