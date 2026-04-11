import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-white">Raihan</span>
              <span className="text-indigo-400">Gazi</span>
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
            <div className="flex flex-col gap-3">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub className="w-4 h-4" /> GitHub
              </Link>
              <Link 
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <FaLinkedin className="w-4 h-4" /> LinkedIn
              </Link>
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <FaTwitter className="w-4 h-4" /> Twitter
              </Link>
              <Link
                href={siteConfig.links.email}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" /> Email
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Built with Next.js, TypeScript, Tailwind CSS & Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}