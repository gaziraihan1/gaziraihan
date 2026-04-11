'use client';

import { useEffect, useRef, useCallback } from 'react';
import { parseMarkdownToHtml } from '@/lib/markdown';

interface BlogMarkdownProps {
  content: string;
}

export function BlogMarkdown({ content }: BlogMarkdownProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const htmlContent = parseMarkdownToHtml(content);

  const handleAnchorClick = useCallback((e: Event) => {
    e.preventDefault();
    const link = e.currentTarget as HTMLAnchorElement;
    const targetId = link.getAttribute('href')?.slice(1);
    
    if (targetId) {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', `#${targetId}`);
      }
    }
  }, []);

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const codeBlocks = contentEl.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre) return;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'absolute top-2 right-2 p-1.5 text-xs text-gray-400 hover:text-white bg-white/10 rounded transition-colors';
      copyBtn.textContent = 'Copy';
      
      copyBtn.onclick = async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(codeBlock.textContent || '');
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = 'Copy'), 2000);
        } catch {
          copyBtn.textContent = 'Failed';
          setTimeout(() => (copyBtn.textContent = 'Copy'), 2000);
        }
      };

      pre.className = 'relative my-6';
      pre.appendChild(copyBtn);
    });

    const anchorLinks = contentEl.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link) => {
      link.addEventListener('click', handleAnchorClick);
    });

    return () => {
      anchorLinks.forEach((link) => {
        link.removeEventListener('click', handleAnchorClick);
      });
    };
  }, [htmlContent, handleAnchorClick]); // ✅ Include dependencies

  return (
    <div 
      ref={contentRef}
      className="prose prose-invert prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}