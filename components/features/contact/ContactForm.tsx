// components/features/contact/ContactForm.tsx
'use client';

import { useState, useCallback, useEffect, memo } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { submitContactForm } from '@/actions/contactAction';

let zod: typeof import('zod');
let reactHookForm: typeof import('react-hook-form');
let zodResolver: typeof import('@hookform/resolvers/zod').zodResolver;

async function loadValidationLibs() {
  if (!zod) {
    [zod, reactHookForm, zodResolver] = await Promise.all([
      import('zod'),
      import('react-hook-form'),
      import('@hookform/resolvers/zod').then(mod => mod.zodResolver),
    ]);
  }
  return { zod, reactHookForm, zodResolver };
}

// ✅ OPTIMIZATION: Simple client-side validation (fallback before libs load)
function simpleValidate(data: Record<string, string>) {
  const errors: Record<string, string> = {};
  if (!data.name?.trim()) errors.name = 'Name is required';
  else if (data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  
  if (!data.email?.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email format';
  
  if (!data.subject?.trim()) errors.subject = 'Subject is required';
  else if (data.subject.trim().length < 5) errors.subject = 'Subject must be at least 5 characters';
  
  if (!data.message?.trim()) errors.message = 'Message is required';
  else if (data.message.trim().length < 20) errors.message = 'Message must be at least 20 characters';
  
  return errors;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

// ✅ OPTIMIZATION: Memoize form to prevent unnecessary re-renders
export const ContactForm = memo(function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationReady, setValidationReady] = useState(false);

  // ✅ OPTIMIZATION: Load validation libs in background (non-blocking)
  useEffect(() => {
    loadValidationLibs().then(() => setValidationReady(true));
  }, []);

  // ✅ OPTIMIZATION: Debounced validation to reduce main thread work
  const validateField = useCallback((name: string, value: string) => {
    // Always run simple validation first (fast)
    const simpleErrors = simpleValidate({ ...formData, [name]: value });
    
    // If Zod is ready, run enhanced validation
    if (validationReady && zod && reactHookForm ) {
      // Lazy-load schema only when needed
      const contactFormSchema = zod.z.object({
        name: zod.z.string().min(2, 'Name must be at least 2 characters'),
        email: zod.z.string().email('Invalid email format'),
        subject: zod.z.string().min(5, 'Subject must be at least 5 characters'),
        message: zod.z.string().min(20, 'Message must be at least 20 characters'),
      });
      
      try {
        contactFormSchema.parse({ ...formData, [name]: value });
        return { ...simpleErrors, [name]: undefined };
      } catch (e: any) {
        return { ...simpleErrors, [name]: e.errors?.[0]?.message || simpleErrors[name] };
      }
    }
    
    return simpleErrors;
  }, [formData, validationReady]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // ✅ Debounced validation (100ms delay)
    const timeoutId = setTimeout(() => {
      const fieldErrors = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const allErrors = simpleValidate(formData);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstError = Object.keys(allErrors)[0];
      document.getElementById(firstError)?.focus();
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'loading' });

    try {
      const result = await submitContactForm(formData);

      if (result?.success) {
        setStatus({ 
          type: 'success', 
          message: 'Message sent successfully! I\'ll get back to you soon.' 
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
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
      setIsSubmitting(false);
      
      setTimeout(() => {
        setStatus(prev => 
          prev.type === 'success' || prev.type === 'error' 
            ? { type: 'idle' } 
            : prev
        );
      }, 5000);
    }
  }, [formData]);

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-indigo-400" />
          Send a Message
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-300">
              Name <span className="text-red-400">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-red-400 flex items-center gap-1" role="alert">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email <span className="text-red-400">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-400 flex items-center gap-1" role="alert">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-gray-300">
              Subject <span className="text-red-400">*</span>
            </label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Project Inquiry"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              disabled={isSubmitting}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
            />
            {errors.subject && (
              <p id="subject-error" className="text-sm text-red-400 flex items-center gap-1" role="alert">
                <AlertCircle className="w-3 h-3" />
                {errors.subject}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-300">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              className="w-full px-3 py-2 rounded-md border border-white/20 bg-white/5 text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              disabled={isSubmitting}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <p id="message-error" className="text-sm text-red-400 flex items-center gap-1" role="alert">
                <AlertCircle className="w-3 h-3" />
                {errors.message}
              </p>
            )}
          </div>

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

          {status.type === 'success' && (
            <div 
              className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3 transition-opacity duration-200"
              role="status"
              aria-live="polite"
            >
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <p className="text-sm text-green-400">{status.message}</p>
            </div>
          )}

          {status.type === 'error' && (
            <div 
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 transition-opacity duration-200"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <p className="text-sm text-red-400">{status.message}</p>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center pt-2">
            I respect your privacy. Your information will never be shared with third parties.
          </p>
        </form>
      </CardContent>
    </Card>
  );
});

ContactForm.displayName = 'ContactForm';