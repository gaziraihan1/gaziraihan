// BentoCard.tsx
'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ReactNode, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  gradientColor?: 'indigo' | 'cyan' | 'purple' | 'pink';
}

const GRADIENT_COLORS = {
  indigo: 'rgba(99, 102, 241, 0.15)',
  cyan:   'rgba(6, 182, 212, 0.15)',
  purple: 'rgba(168, 85, 247, 0.15)',
  pink:   'rgba(236, 72, 153, 0.15)',
} as const;

function BentoCardMobile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm',
        'active:scale-[0.98] transition-transform duration-100',
        className
      )}
    >
      <div className="relative z-10 h-full p-6">{children}</div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-active:ring-white/20 transition duration-300" />
    </div>
  );
}

function BentoCardDesktop({ children, className, gradientColor = 'indigo' }: BentoCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const color = GRADIENT_COLORS[gradientColor];
  const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 80%)`;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm',
        'hover:border-white/20 transition-colors',
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10 h-full p-6">{children}</div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition duration-300" />
    </motion.div>
  );
}

export function BentoCard(props: BentoCardProps) {
  // ✅ Default true so first render on mobile skips motion entirely (no flash)
  const isMobile = useMediaQuery('(max-width: 768px)', true);

  if (isMobile) return <BentoCardMobile className={props.className}>{props.children}</BentoCardMobile>;
  return <BentoCardDesktop {...props} />;
}