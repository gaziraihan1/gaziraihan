// app/(public)/contact/page.tsx
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { ContactInfo } from '@/components/features/contact/ContactInfo';
import { FAQSection } from '@/components/features/contact/FaqSection';
// ✅ OPTIMIZATION: Lazy-load heavy ContactForm component
import dynamic from 'next/dynamic';

// ✅ Lazy-load ContactForm with loading state (reduces initial bundle)
const ContactForm = dynamic(
  () => import('@/components/features/contact/ContactForm').then(mod => mod.ContactForm),
  {
    loading: () => (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-white/10 rounded w-1/4" />
              <div className="h-10 bg-white/10 rounded" />
            </div>
          ))}
        </div>
        <div className="h-12 bg-white/10 rounded mt-6" />
      </div>
    ),
    ssr: true, // ✅ Still render on server for SEO, but lazy-load JS
  }
);

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

// ✅ OPTIMIZATION: Enable static generation (Contact page rarely changes)
export const revalidate = 3600; // 24 hours ISR

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* ✅ OPTIMIZATION: Inline critical above-fold content */}
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
          <div className="lg:col-span-2">
            {/* ✅ Lazy-loaded ContactForm with skeleton */}
            <ContactForm />
          </div>

          <div className="lg:col-span-1">
            {/* ✅ ContactInfo is lightweight - render immediately */}
            <ContactInfo />
          </div>
        </div>

        {/* ✅ FAQSection can be lazy-loaded too if it's heavy */}
        <FAQSection />
      </div>
    </div>
  );
}