// lib/email.ts
import { Resend } from 'resend';
import { siteConfig } from '@/config/site';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData) {
  const { name, email, subject, message } = data;

  // Send notification to you
  await resend.emails.send({
    from: 'Portfolio <onboarding@resend.dev>', // Replace with your verified domain
    to: process.env.CONTACT_EMAIL || 'you@example.com',
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">New Contact Form Submission</h2>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          Submitted from ${siteConfig.url} on ${new Date().toLocaleDateString()}
        </p>
      </div>
    `,
  });

  // Optional: Send auto-reply to sender
  await resend.emails.send({
    from: 'Portfolio <onboarding@resend.dev>',
    to: email,
    subject: 'Thanks for reaching out!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Thanks for contacting me!</h2>
        
        <p>Hi ${name},</p>
        
        <p>Thank you for reaching out. I've received your message and will get back to you within 24-48 hours.</p>
        
        <p>In the meantime, feel free to check out my portfolio at <a href="${siteConfig.url}">${siteConfig.url}</a></p>
        
        <p>Best regards,<br/>${siteConfig.name}</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This is an automated response. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  });
}