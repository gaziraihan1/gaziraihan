// lib/markdown.ts
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

// ✅ Configure marked with v9+ compatible options
marked.setOptions({
  breaks: true,
  gfm: true,
});

// ✅ Parse markdown to safe HTML
export function parseMarkdownToHtml(markdown: string): string {
  const rawHtml = marked.parse(markdown) as string;
  
  // ✅ Sanitize with DOMPurify (works in both server and client)
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['target'],
    FORCE_BODY: true,
    // ✅ Optional: Add more security for serverless
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'strong', 'em', 'u', 'del', 's', 'strike',
      'a', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel']
  });
  
  return cleanHtml;
}

// ✅ Extract headings for Table of Contents
export function extractHeadings(markdown: string): Array<{ level: number; text: string; id: string }> {
  const headings: Array<{ level: number; text: string; id: string }> = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    headings.push({ level, text, id });
  }
  
  return headings;
}