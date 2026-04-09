// components/features/home/hero-card.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { BentoCard } from '@/components/animations/BentoCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

export function HeroCard() {
  return (
    <div className="md:col-span-2 md:row-span-2">
      <BentoCard gradientColor="indigo" className="h-full">
        <motion.div
          className="flex flex-col justify-center h-full p-6 md:p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <Badge variant="secondary" className="gap-2 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Available for new opportunities
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Building{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400">
              Scalable
            </span>{' '}
            Web Experiences
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-gray-400 text-lg md:text-xl mb-8 max-w-xl"
          >
            I&apos;m a Full Stack Developer & UI/UX Developer bridging the gap between
            complex backend architecture and pixel-perfect frontend design.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Button size="lg" asChild className="group">
              <Link href="/projects">
                View My Work
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact Me
              </Link>
            </Button>

            <Button size="lg" variant="ghost" asChild>
              <Link href="/resume.pdf" target="_blank">
                <Download className="mr-2 h-4 w-4" />
                Resume
              </Link>
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-3xl font-bold text-white">1+</p>
                <p className="text-sm text-gray-500">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">7+</p>
                <p className="text-sm text-gray-500">Projects Completed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">2+</p>
                <p className="text-sm text-gray-500">Happy Clients</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </BentoCard>
    </div>
  );
}