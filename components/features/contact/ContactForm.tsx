// components/features/contact/contact-form.tsx
'use client';

import { useState } from 'react'; // ✅ Removed useTransition (not needed for async forms)
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { contactFormSchema } from '@/lib/validation/contact';
import { submitContactForm } from '@/actions/contactAction'; // ✅ Fixed: kebab-case import

type FormData = z.infer<typeof contactFormSchema>;

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Renamed for clarity
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // ✅ FIXED: Add 'data' parameter - this is where react-hook-form passes form values
  const onSubmit = async (data: FormData) => {
    // ✅ Set submitting state BEFORE async call
    setIsSubmitting(true);
    setStatus({ type: 'loading' });

    try {
      // ✅ Call server action with form data
      const result = await submitContactForm(data);

      if (result?.success) {
        setStatus({ 
          type: 'success', 
          message: 'Message sent successfully! I\'ll get back to you soon.' 
        });
        reset(); // ✅ Reset form fields after success
      } else {
        setStatus({ 
          type: 'error', 
          message: result?.error || 'Something went wrong. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus({ 
        type: 'error', 
        message: 'Failed to send message. Please try again later.' 
      });
    } finally {
      // ✅ Always reset submitting state
      setIsSubmitting(false);
      
      // ✅ Auto-clear status messages after 5 seconds
      setTimeout(() => {
        setStatus((prev) => (prev.type === 'success' || prev.type === 'error' ? { type: 'idle' } : prev));
      }, 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-400" />
            Send a Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✅ Pass onSubmit to handleSubmit - react-hook-form will call it with form data */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            
            {/* Name Field */}
            <div className="space-y-4">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Name <span className="text-red-400">*</span>
              </label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                disabled={isSubmitting}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-400 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-4">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email <span className="text-red-400">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                disabled={isSubmitting}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-400 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Subject Field */}
            <div className="space-y-4">
              <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                Subject <span className="text-red-400">*</span>
              </label>
              <Input
                id="subject"
                placeholder="Project Inquiry"
                {...register('subject')}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                disabled={isSubmitting}
                aria-invalid={errors.subject ? 'true' : 'false'}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
              />
              {errors.subject && (
                <p id="subject-error" className="text-sm text-red-400 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" />
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-4">
              <label htmlFor="message" className="text-sm font-medium text-gray-300">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                rows={6}
                placeholder="Tell me about your project..."
                {...register('message')}
                className="w-full px-3 py-2 rounded-md border border-white/20 bg-white/5 text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                disabled={isSubmitting}
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <p id="message-error" className="text-sm text-red-400 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" />
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full gap-2"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </Button>

            {/* Status Messages with Animations */}
            <AnimatePresence mode="wait">
              {status.type === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <p className="text-sm text-green-400">{status.message}</p>
                </motion.div>
              )}

              {status.type === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <p className="text-sm text-red-400">{status.message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 text-center pt-2">
              I respect your privacy. Your information will never be shared with third parties.
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}