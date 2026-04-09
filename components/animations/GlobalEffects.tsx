// components/animations/GlobalEffects.tsx
'use client';

import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0a]">
      {/* Gradient Blob 1 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] h-125 w-125 rounded-full bg-indigo-600/20 blur-[120px]"
      />
      {/* Gradient Blob 2 */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute top-[40%] -right-[10%] h-150 w-150 rounded-full bg-cyan-600/10 blur-[120px]"
      />
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>
  );
}

export function GlowCursor() {
  const { x, y } = useMousePosition();

  return (
    <>
      {/* Main Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white pointer-events-none z-50 hidden md:block"
        animate={{ x, y }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      {/* Glow Effect */}
      <motion.div
        className="fixed top-0 left-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[60px] pointer-events-none z-40 hidden md:block mix-blend-screen"
        animate={{ x, y }}
        transition={{ type: "spring", stiffness: 150, damping: 40 }}
      />
    </>
  );
}