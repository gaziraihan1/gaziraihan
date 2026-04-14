// components/admin/SEOSettings.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { bulkUpdateSiteConfig } from '@/actions/adminSettings';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const seoSchema = z.object({
  og_title: z.string().max(200).optional(),
  og_description: z.string().max(500).optional(),
  twitter_username: z.string().max(100).optional().or(z.literal('')),
  github_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof seoSchema>;

interface SEOSettingsProps {
  config: Record<string, any>;
}

export function SEOSettings({ config }: SEOSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      og_title: config.og_title || '',
      og_description: config.og_description || '',
      twitter_username: config.twitter_username || '',
      github_url: config.github_url || '',
      linkedin_url: config.linkedin_url || '',
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
        toast.success('SEO settings updated successfully');
      } else {
        toast.error(result?.error || 'Failed to update SEO settings');
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
            <Search className="w-5 h-5 text-indigo-400" />
            SEO & Social Media
          </CardTitle>
          <CardDescription className="text-gray-400">
            Optimize your site for search engines and social sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OG Title */}
          <div className="space-y-2">
            <Label className="text-gray-300">Open Graph Title</Label>
            <Input
              {...register('og_title')}
              className="bg-white/5 border-white/10 text-white"
              placeholder="My Portfolio | Developer"
            />
            {errors.og_title && <p className="text-sm text-red-400">{errors.og_title.message}</p>}
            <p className="text-xs text-gray-500">Title shown when sharing on social media</p>
          </div>

          {/* OG Description */}
          <div className="space-y-2">
            <Label className="text-gray-300">Open Graph Description</Label>
            <Textarea
              {...register('og_description')}
              rows={3}
              className="bg-white/5 border-white/10 text-white resize-none"
              placeholder="Full Stack Developer specializing in..."
            />
            {errors.og_description && (
              <p className="text-sm text-red-400">{errors.og_description.message}</p>
            )}
            <p className="text-xs text-gray-500">Description shown when sharing on social media</p>
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <h4 className="text-sm font-medium text-white">Social Media Links</h4>

            {/* GitHub */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <FaGithub className="w-4 h-4" />
                GitHub URL
              </Label>
              <Input
                {...register('github_url')}
                className="bg-white/5 border-white/10 text-white"
                placeholder="https://github.com/username"
              />
              {errors.github_url && (
                <p className="text-sm text-red-400">{errors.github_url.message}</p>
              )}
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <FaLinkedin className="w-4 h-4" />
                LinkedIn URL
              </Label>
              <Input
                {...register('linkedin_url')}
                className="bg-white/5 border-white/10 text-white"
                placeholder="https://linkedin.com/in/username"
              />
              {errors.linkedin_url && (
                <p className="text-sm text-red-400">{errors.linkedin_url.message}</p>
              )}
            </div>

            {/* Twitter */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <FaTwitter className="w-4 h-4" />
                Twitter Username
              </Label>
              <Input
                {...register('twitter_username')}
                className="bg-white/5 border-white/10 text-white"
                placeholder="@username"
              />
              {errors.twitter_username && (
                <p className="text-sm text-red-400">{errors.twitter_username.message}</p>
              )}
            </div>
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