// components/features/uses/HardwareSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Monitor, Keyboard, Mouse, Headphones, Cpu, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UsesItem } from '@/actions/uses'; // ✅ Now includes category
import Image from 'next/image';

interface HardwareSectionProps {
  hardware: UsesItem[];
}

const hardwareIcons: Record<string, React.ReactNode> = {
  Computer: <Cpu className="w-5 h-5" />,
  Display: <Monitor className="w-5 h-5" />,
  Keyboard: <Keyboard className="w-5 h-5" />,
  Mouse: <Mouse className="w-5 h-5" />,
  Audio: <Headphones className="w-5 h-5" />,
  Other: <Cpu className="w-5 h-5" />,
};

export function HardwareSection({ hardware }: HardwareSectionProps) {
  if (hardware.length === 0) return null;

  // ✅ Group hardware by category (with type-safe access)
  const grouped = hardware.reduce((acc, item) => {
    const category = item.category || 'Other'; // ✅ category now exists on UsesItem
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, UsesItem[]>);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <Cpu className="w-6 h-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Hardware</h2>
      </div>
      
      <div className="grid gap-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              {hardwareIcons[category] || hardwareIcons.Other}
              {category}
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    {item.image && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-white truncate">{item.name}</h4>
                        {item.isFavorite && (
                          <span className="text-amber-400" title="Favorite">★</span>
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      {/* Price & Link */}
                      <div className="flex items-center justify-between mt-3">
                        {item.price && (
                          <span className="text-sm text-gray-500">{item.price}</span>
                        )}
                        {item.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-indigo-400 hover:text-indigo-300 p-0 h-auto"
                            asChild
                          >
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              View <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}