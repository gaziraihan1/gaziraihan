// components/admin/AdminLoginForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react'; // ✅ Import getSession
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code2, Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Get callbackUrl once at mount (more reliable than in effects)
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  // ✅ Check session on mount and when callbackUrl changes
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session?.user?.role === 'ADMIN') {
          router.replace(callbackUrl);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    };
    
    checkSession();
  }, [router, callbackUrl]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl, // ✅ Pass callbackUrl directly to signIn
        redirect: true, // ✅ Let NextAuth handle the redirect
      });
      
      // If we get here, signIn failed (redirect didn't happen)
      setError('Sign in failed. Please check your credentials.');
      
      /* 
      // ✅ Option B: Manual redirect (if you need more control)
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      // ✅ Manually fetch updated session to get role
      const session = await getSession();
      
      if (session?.user?.role === 'ADMIN') {
        router.replace(callbackUrl);
        router.refresh();
      } else {
        setError('Access denied. Admin role required.');
      }
      */
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-indigo-500/20 mb-4">
              <Code2 className="w-8 h-8 text-indigo-400" />
            </div>
            <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="pl-10 bg-white/5 border-white/10 text-white"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-white/5 border-white/10 text-white"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <p className="mt-4 text-xs text-center text-gray-500">
              Protected area. Authorized personnel only.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}