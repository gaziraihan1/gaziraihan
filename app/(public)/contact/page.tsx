// app/(public)/contact/page.tsx
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { ContactForm } from '@/components/features/contact/ContactForm';
import { ContactInfo } from '@/components/features/contact/ContactInfo';
import { FAQSection } from '@/components/features/contact/FaqSection';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for project inquiries, collaborations, or just to say hello. I respond to all messages within 24-48 hours.',
  openGraph: {
    title: `Contact | ${siteConfig.name}`,
    description: 'Get in touch for project inquiries and collaborations.',
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Contact | ${siteConfig.name}`,
    description: 'Get in touch for project inquiries and collaborations.',
    images: [siteConfig.ogImage],
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let&apos;s Work Together
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have a project in mind? Looking for a senior developer? Or just want to say hello? 
            I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form (2/3 width) */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Info (1/3 width) */}
          <div className="lg:col-span-1">
            <ContactInfo />
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection />
      </div>
    </div>
  );
}