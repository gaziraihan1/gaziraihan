'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { BentoCard } from '@/components/animations/BentoCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ContactCard() {
  return (
    <div className="md:col-span-1 md:row-span-1">
      <BentoCard gradientColor="cyan" className="h-full">
        <motion.div
          className="flex flex-col justify-center h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Let&apos;s Talk</h3>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            Have a project in mind or want to discuss opportunities? I&apos;d love to hear from you.
          </p>

          <div className="space-y-3">
            <Link
              href="mailto:gazyraihan3@gmail.com"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              gazyraihan3@gmail.com
            </Link>

            <Button className="w-full" size="sm" asChild>
              <Link href="/contact">
                Send Message
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs text-gray-400">Available for freelance</span>
            </div>
          </div>
        </motion.div>
      </BentoCard>
    </div>
  );
}