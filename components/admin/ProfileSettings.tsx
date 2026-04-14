// components/admin/ProfileSettings.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Lock, Mail, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateProfile } from '@/actions/adminSettings';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

type FormData = z.infer<typeof profileSchema>;

interface User {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

interface ProfileSettingsProps {
  user: User ;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateProfile(data);
      if (result?.success) {
        toast.success('Profile updated successfully');
        reset({ ...data, currentPassword: '', newPassword: '' });
        setShowPasswordFields(false);
      } else {
        toast.error(result?.error || 'Failed to update profile');
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
            <UserIcon className="w-5 h-5 text-indigo-400" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-gray-400">
            Update your account details and password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-gray-300">Name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                {...register('name')}
                className="pl-10 bg-white/5 border-white/10 text-white"
                placeholder="Your name"
              />
            </div>
            {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-gray-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                {...register('email')}
                type="email"
                className="pl-10 bg-white/5 border-white/10 text-white"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
          </div>

          {/* Password Toggle */}
          <div className="pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className="text-indigo-400 hover:text-indigo-300"
            >
              <Lock className="w-4 h-4 mr-2" />
              {showPasswordFields ? 'Cancel' : 'Change Password'}
            </Button>
          </div>

          {/* Password Fields */}
          {showPasswordFields && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <Label className="text-gray-300">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    {...register('currentPassword')}
                    type="password"
                    className="pl-10 bg-white/5 border-white/10 text-white"
                    placeholder="••••••••"
                  />
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-400">{errors.currentPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    {...register('newPassword')}
                    type="password"
                    className="pl-10 bg-white/5 border-white/10 text-white"
                    placeholder="••••••••"
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-400">{errors.newPassword.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Account Info */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-gray-500">
              Account created: {new Date(user.createdAt).toLocaleDateString()}
            </p>
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