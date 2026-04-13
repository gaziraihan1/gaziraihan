// components/features/uses/SoftwareSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Code, Globe, Terminal, Palette, FileText, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UsesItem } from '@/actions/uses'; // ✅ Now includes category, isPaid

interface SoftwareSectionProps {
  software: UsesItem[];
}

const softwareIcons: Record<string, React.ReactNode> = {
  IDE: <Code className="w-5 h-5" />,
  Browser: <Globe className="w-5 h-5" />,
  Terminal: <Terminal className="w-5 h-5" />,
  Design: <Palette className="w-5 h-5" />,
  Productivity: <FileText className="w-5 h-5" />,
  Other: <Code className="w-5 h-5" />,
};

export function SoftwareSection({ software }: SoftwareSectionProps) {
  if (software.length === 0) return null;

  // ✅ Group software by category (type-safe now)
  const grouped = software.reduce((acc, item) => {
    const category = item.category || 'Other'; // ✅ category now exists
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
        <Code className="w-6 h-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Software & Tools</h2>
      </div>
      
      <div className="grid gap-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              {softwareIcons[category] || softwareIcons.Other}
              {category}
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white truncate">{item.name}</h4>
                        {item.isFavorite && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      {/* Badges - ✅ isPaid and category now exist */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.isPaid && ( // ✅ isPaid now exists on UsesItem
                          <Badge variant="secondary" className="text-[10px]">Paid</Badge>
                        )}
                        {item.category && ( // ✅ category now exists on UsesItem
                          <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Link */}
                    {item.url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        asChild
                      >
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
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