'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Command } from 'lucide-react';

const commands = [
  { id: '1', label: 'Go to Projects', shortcut: 'G P' },
  { id: '2', label: 'View Experience', shortcut: 'G E' },
  { id: '3', label: 'Contact Me', shortcut: 'G C' },
  { id: '4', label: 'Download Resume', shortcut: 'D R' },
];

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed left-[50%] top-[20%] z-50 w-full max-w-lg -translate-x-[50%] rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl"
            >
              <div className="flex items-center border-b border-white/10 px-4 py-3">
                <Command className="mr-2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                  autoFocus
                />
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-gray-400">
                  ESC
                </kbd>
              </div>
              <div className="max-h-75 overflow-y-auto p-2">
                {commands.map((cmd) => (
                  <motion.div
                    key={cmd.id}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-gray-300 cursor-pointer"
                  >
                    <span>{cmd.label}</span>
                    <span className="text-xs text-gray-500">{cmd.shortcut}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 backdrop-blur-md">
        <Command size={14} />
        <span>Cmd + K</span>
      </div>
    </>
  );
}