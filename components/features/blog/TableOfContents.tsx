'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches = [...content.matchAll(headingRegex)];
    
    const items: TOCItem[] = matches.map((match) => ({
      id: match[2].toLowerCase().replace(/\s+/g, '-'),
      text: match[2],
      level: match[1].length,
    }));

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <List className="w-5 h-5 text-indigo-400" />
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="space-y-2">
          {headings.map((heading) => (
            <motion.a
              key={heading.id}
              href={`#${heading.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`block text-sm transition-colors ${
                activeId === heading.id
                  ? 'text-indigo-400 font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
            >
              {heading.text}
            </motion.a>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}