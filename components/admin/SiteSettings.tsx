// components/admin/SiteSettings.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { bulkUpdateSiteConfig } from '@/actions/adminSettings';

const siteConfigSchema = z.object({
  site_title: z.string().min(2, 'Site title is required').max(200),
  site_description: z.string().max(500).optional(),
  hero_title: z.string().max(200).optional(),
  hero_subtitle: z.string().max(500).optional(),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

type FormData = z.infer<typeof siteConfigSchema>;

interface SiteSettingsProps {
  config: Record<string, any>;
}

export function SiteSettings({ config }: SiteSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: {
      site_title: config.site_title || '',
      site_description: config.site_description || '',
      hero_title: config.hero_title || '',
      hero_subtitle: config.hero_subtitle || '',
      contact_email: config.contact_email || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // ✅ Convert to bulk update format
      const items = Object.entries(data)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => ({
          key,
          value: value as string,
        }));

      const result = await bulkUpdateSiteConfig(items);
      if (result?.success) {
        toast.success('Site configuration updated successfully');
      } else {
        toast.error(result?.error || 'Failed to update site configuration');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            Site Configuration
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage your site&apos;s basic information and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Site Title */}
          <div className="space-y-2">
            <Label className="text-gray-300">Site Title *</Label>
            <Input
              {...register('site_title')}
              className="bg-white/5 border-white/10 text-white"
              placeholder="My Portfolio"
            />
            {errors.site_title && (
              <p className="text-sm text-red-400">{errors.site_title.message}</p>
            )}
          </div>

          {/* Site Description */}
          <div className="space-y-2">
            <Label className="text-gray-300">Site Description</Label>
            <Textarea
              {...register('site_description')}
              rows={3}
              className="bg-white/5 border-white/10 text-white resize-none"
              placeholder="A brief description of your site..."
            />
            {errors.site_description && (
              <p className="text-sm text-red-400">{errors.site_description.message}</p>
            )}
          </div>

          {/* Hero Title */}
          <div className="space-y-2">
            <Label className="text-gray-300">Hero Title</Label>
            <Input
              {...register('hero_title')}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Full Stack Developer"
            />
            {errors.hero_title && (
              <p className="text-sm text-red-400">{errors.hero_title.message}</p>
            )}
          </div>

          {/* Hero Subtitle */}
          <div className="space-y-2">
            <Label className="text-gray-300">Hero Subtitle</Label>
            <Textarea
              {...register('hero_subtitle')}
              rows={2}
              className="bg-white/5 border-white/10 text-white resize-none"
              placeholder="Building amazing web experiences..."
            />
            {errors.hero_subtitle && (
              <p className="text-sm text-red-400">{errors.hero_subtitle.message}</p>
            )}
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <Label className="text-gray-300">Contact Email</Label>
            <Input
              {...register('contact_email')}
              type="email"
              className="bg-white/5 border-white/10 text-white"
              placeholder="contact@example.com"
            />
            {errors.contact_email && (
              <p className="text-sm text-red-400">{errors.contact_email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}