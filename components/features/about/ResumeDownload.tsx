'use client';

import { motion } from 'framer-motion';
import { Download, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ResumeDownload() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10 rounded-3xl p-8 md:p-12"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/10 mb-4">
            <FileText className="w-8 h-8 text-indigo-400" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Want to Know More?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Download my full resume for a comprehensive overview of my experience, 
            skills, and achievements. Available in PDF format.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="group">
              <a href="/resume.pdf" download>
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </a>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                Contact Me
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="pt-8 mt-8 border-t border-white/10 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <p className="text-2xl font-bold text-white">1+</p>
              <p className="text-xs text-gray-500">Years Experience</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">7+</p>
              <p className="text-xs text-gray-500">Projects Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-gray-500">Happy Clients</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}