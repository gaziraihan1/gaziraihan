'use client';

import { motion } from 'framer-motion';
import { FolderOpen, MessageSquare, Code2, Briefcase, FileText, Eye, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardStatsProps {
  stats: {
    projects: number;
    messages: number;
    unreadMessages: number;
    skills: number;
    experience: number;
    blogPosts?: number;      // ← Optional
    totalViews?: number;     // ← Optional
    conversionRate?: number; // ← Optional
  };
}

const statCards = [
  {
    title: 'Total Projects',
    value: (stats: any) => stats.projects,
    icon: FolderOpen,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    description: 'Showcased on portfolio',
  },
  {
    title: 'Total Messages',
    value: (stats: any) => stats.messages,
    icon: MessageSquare,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    description: 'Contact form submissions',
  },
  {
    title: 'Unread Messages',
    value: (stats: any) => stats.unreadMessages,
    icon: Eye,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    description: 'Awaiting response',
  },
  {
    title: 'Skills',
    value: (stats: any) => stats.skills,
    icon: Code2,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    description: 'Technologies listed',
  },
  {
    title: 'Experience',
    value: (stats: any) => stats.experience,
    icon: Briefcase,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    description: 'Work history entries',
  },
  {
    title: 'Blog Posts',
    value: (stats: any) => stats.blogPosts ?? 0,  // ← Handle undefined
    icon: FileText,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    description: 'Published articles',
  },
  {
    title: 'Total Views',
    value: (stats: any) => stats.totalViews ?? 0,  // ← Handle undefined
    icon: TrendingUp,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    description: 'All-time page views',
  },
  {
    title: 'Conversion Rate',
    value: (stats: any) => `${stats.conversionRate ?? 0}%`,  // ← Handle undefined
    icon: Users,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    description: 'Visitors to contacts',
  },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-white">
                      {card.value(stats)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bg}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}