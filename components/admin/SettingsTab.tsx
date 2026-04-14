// components/admin/SettingsTabs.tsx
'use client';

import { useState } from 'react';
import { User, Globe, Search } from 'lucide-react';
import { ProfileSettings } from './ProfileSettings';
import { SiteSettings } from './SiteSettings';
import { SEOSettings } from './SeoSettings';

interface User {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

interface SettingsTabsProps {
  user: User ;
  config: Record<string, any>;
}

type Tab = 'profile' | 'site' | 'seo';

export function SettingsTabs({ user, config }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'site', label: 'Site Config', icon: <Globe className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO', icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-white/10">
        <nav className="flex gap-2 overflow-x-auto pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-100">
        {activeTab === 'profile' && <ProfileSettings user={user} />}
        {activeTab === 'site' && <SiteSettings config={config} />}
        {activeTab === 'seo' && <SEOSettings config={config} />}
      </div>
    </div>
  );
}