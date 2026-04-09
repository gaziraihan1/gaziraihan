// components/animations/BentoCard.tsx
'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils'; // ✅ Import cn utility for class merging

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  gradientColor?: 'indigo' | 'cyan' | 'purple' | 'pink'; // ✅ Type-safe colors
}

export function BentoCard({ 
  children, 
  className = '', 
  gradientColor = 'indigo' 
}: BentoCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // ✅ Type-safe color map with fallback
  const colorMap: Record<string, string> = {
    indigo: 'rgba(99, 102, 241, 0.15)',
    cyan: 'rgba(6, 182, 212, 0.15)',
    purple: 'rgba(168, 85, 247, 0.15)',
    pink: 'rgba(236, 72, 153, 0.15)',
  };

  const bgGradient = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${colorMap[gradientColor] || colorMap.indigo}, transparent 80%)`;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      // ✅ FIXED: Add pointer-events-auto to ensure clicks pass through to children
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm',
        'pointer-events-auto', // ✅ Critical: Allow clicks to reach child elements
        'hover:border-white/20 transition-colors',
        className
      )}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* ✅ FIXED: Hover Glow Effect - keep pointer-events-none so it doesn't block clicks */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: bgGradient }}
      />
      
      {/* ✅ FIXED: Content container with higher z-index to sit above glow effect */}
      <div className="relative z-10 h-full p-6">
        {children}
      </div>
      
      {/* ✅ Border Glow on Hover - also pointer-events-none */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition duration-300" />
    </motion.div>
  );
}