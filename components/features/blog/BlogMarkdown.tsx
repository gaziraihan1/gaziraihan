// components/features/blog/blog-markdown.tsx
'use client';

import { useEffect, useRef } from 'react';
import { parseMarkdownToHtml } from '@/lib/markdown';

interface BlogMarkdownProps {
  content: string;
}

export function BlogMarkdown({ content }: BlogMarkdownProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // ✅ Parse markdown to HTML on mount
  // (Could also do this on server for better performance)
  const htmlContent = parseMarkdownToHtml(content);

  // ✅ Add click handlers for code block copy buttons (optional)
  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    // Add copy buttons to code blocks
    const codeBlocks = contentEl.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre) return;

      // Create copy button
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

      // Position button container
      pre.className = 'relative my-6';
      pre.appendChild(copyBtn);
    });

    // Add smooth scroll for anchor links (for TOC)
    const anchorLinks = contentEl.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = (link as HTMLAnchorElement).getAttribute('href')?.slice(1);
        if (targetId) {
          const target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Update URL without jump
            history.pushState(null, '', `#${targetId}`);
          }
        }
      });
    });

    return () => {
      // Cleanup event listeners if needed
      anchorLinks.forEach((link) => {
        link.removeEventListener('click', () => {});
      });
    };
  }, [htmlContent]);

  return (
    <div 
      ref={contentRef}
      className="prose prose-invert prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}