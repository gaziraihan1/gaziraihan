'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10" 
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-white">Raihan </span>
            <span className="text-indigo-400">Gazi</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href={siteConfig.links.github} aria-label='Github'>
              <FaGithub className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
            </Link>
            <Link href={siteConfig.links.linkedin} aria-label='Linkedin'>
              <FaLinkedin className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
            </Link>
            <Link href={siteConfig.links.twitter} aria-label='Twitter / X'>
              <FaTwitter className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
            </Link>
            <Button size="sm" asChild>
              <Link href="/contact">Let&apos;s Talk</Link>
            </Button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] md:hidden"
          >
            <div className="flex flex-col h-full p-6 pt-20">
              <nav className="flex flex-col gap-6">
                {siteConfig.navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-semibold text-gray-400 hover:text-white transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
              
              <div className="mt-auto flex flex-col gap-4">
                <div className="flex gap-4">
                  <Link href={siteConfig.links.github} aria-label='Github'>
                    <FaGithub className="w-6 h-6 text-gray-400" />
                  </Link>
                  <Link href={siteConfig.links.linkedin} aria-label='Linkedin'>
                    <FaLinkedin className="w-6 h-6 text-gray-400" />
                  </Link>
                  <Link href={siteConfig.links.twitter} aria-label='Twitter / X'>
                    <FaTwitter className="w-6 h-6 text-gray-400" />
                  </Link>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                    Let&apos;s Talk
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}