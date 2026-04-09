// actions/contact-actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { contactFormSchema } from '@/lib/validation/contact';
import { sendContactEmail } from '@/lib/email';
import { headers } from 'next/headers';
import { ratelimit } from '@/lib/rateLimit';

interface FormResult {
  success: boolean;
  error?: string;
}

export async function submitContactForm(
  rawData: z.infer<typeof contactFormSchema>
): Promise<FormResult> {
  // 1. Validate input
  const validatedFields = contactFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid form data. Please check your input.',
    };
  }

  const { name, email, subject, message } = validatedFields.data;

  // 2. Rate Limiting (Spam Protection)
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
  
  const { success: rateLimitSuccess } = await ratelimit.limit(ip);
  
  if (!rateLimitSuccess) {
    return {
      success: false,
      error: 'Too many requests. Please try again later.',
    };
  }

  // 3. Save to Database
  try {
    await prisma.contactMessage.create({
       data: {
        name,
        email,
        subject,
        message,
        ipAddr: ip,
        userAgent: headersList.get('user-agent') || '',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return {
      success: false,
      error: 'Failed to save message. Please try again.',
    };
  }

  // 4. Send Email Notification
  try {
    await sendContactEmail({
      name,
      email,
      subject,
      message,
    });
  } catch (error) {
    console.error('Email error:', error);
    // Don't fail the form if email fails, just log it
  }

  return { success: true };
}