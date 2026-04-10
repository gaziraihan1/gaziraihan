// app/(admin)/admin/page.tsx
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentMessages } from '@/components/admin/RecentMessages';
import { RecentProjects } from '@/components/admin/RecentProjects';
import { QuickActions } from '@/components/admin/QuickActions';

export const metadata: Metadata = {
  title: 'Dashboard | Admin',
  description: 'Admin dashboard overview',
};

async function getDashboardData() {
  const [
    projectCount,
    messageCount,
    unreadMessages,
    skillCount,
    experienceCount,
    recentMessages,
    recentProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.skill.count(),
    prisma.experience.count(),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    }),
  ]);

  return {
    stats: {
      projects: projectCount,
      messages: messageCount,
      unreadMessages,
      skills: skillCount,
      experience: experienceCount,
    },
    recentMessages,
    recentProjects,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8 ">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here&apos;s what&apos;s happening with your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Messages */}
        <RecentMessages messages={data.recentMessages} />

        {/* Recent Projects */}
        <RecentProjects projects={data.recentProjects} />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}