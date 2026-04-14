// app/(admin)/admin/settings/page.tsx
import { Metadata } from 'next';
import { getAdminSettings } from '@/actions/adminSettings';
import { SettingsTabs } from '@/components/admin/SettingsTab';

export const metadata: Metadata = {
  title: 'Settings | Admin',
  description: 'Manage your admin settings and site configuration.',
};

export const revalidate = 3600;

export default async function SettingsPage() {
  const settings = await getAdminSettings();

  if (!settings || !settings.user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Unable to load settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and site configuration.</p>
      </div>

      <SettingsTabs user={settings.user} config={settings.config} />
    </div>
  );
}