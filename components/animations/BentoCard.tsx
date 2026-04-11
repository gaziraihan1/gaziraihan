// components/animations/BentoCard.tsx
'use client';

import { motion, useMotionTemplate, useMotionValue, type Transition } from 'framer-motion';
import { ReactNode, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  gradientColor?: 'indigo' | 'cyan' | 'purple' | 'pink';
}

export function BentoCard({ 
  children, 
  className = '', 
  gradientColor = 'indigo' 
}: BentoCardProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const colorMap = useMemo(() => ({
    indigo: 'rgba(99, 102, 241, 0.15)',
    cyan: 'rgba(6, 182, 212, 0.15)',
    purple: 'rgba(168, 85, 247, 0.15)',
    pink: 'rgba(236, 72, 153, 0.15)',
  }), []);
  
  const bgGradient = useMemo(() => {
    if (isMobile) return undefined;
    return useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${colorMap[gradientColor] || colorMap.indigo}, transparent 80%)`;
  }, [isMobile, gradientColor, colorMap, mouseX, mouseY]);
  
  // ✅ FIXED: Use proper Transition type + as const for literal types
  const hoverProps = useMemo(() => {
    if (isMobile) {
      const mobileTransition: Transition = { type: 'tween', duration: 0.1 };
      return {
        whileHover: undefined,
        whileTap: { scale: 0.98 },
        transition: mobileTransition,
      };
    }
    const desktopTransition: Transition = { type: 'spring', stiffness: 300, damping: 20 };
    return {
      whileHover: { scale: 1.02, y: -5 },
      whileTap: { scale: 0.98 },
      transition: desktopTransition,
    };
  }, [isMobile]);
  
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (isMobile) return;
    const { currentTarget, clientX, clientY } = event;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }, [isMobile, mouseX, mouseY]);
  
  const mobileHoverClass = isMobile 
    ? 'active:scale-[0.98] active:transition-transform active:duration-100' 
    : '';

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm',
        'pointer-events-auto',
        'transition-colors',
        mobileHoverClass,
        !isMobile && 'hover:border-white/20',
        className
      )}
      {...hoverProps}
      // ✅ FIXED: Proper type for will-change style
      style={isMobile ? { willChange: 'transform' } as React.CSSProperties : undefined}
    >
      {!isMobile && bgGradient && (
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: bgGradient }}
        />
      )}
      
      <div className="relative z-10 h-full p-6">
        {children}
      </div>
      
      <div 
        className={cn(
          'pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition duration-300',
          isMobile ? 'group-active:ring-white/20' : 'group-hover:ring-white/20'
        )} 
      />
    </motion.div>
  );
}