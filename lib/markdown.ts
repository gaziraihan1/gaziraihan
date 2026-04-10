// lib/markdown.ts
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';


// ✅ FIXED: Configure marked with v9+ compatible options
marked.setOptions({
  breaks: true, // Enable line breaks (<br> for newlines)
  gfm: true, // Enable GitHub Flavored Markdown
  // ✅ REMOVED: headerIds, mangle, sanitize (not in marked v9+)
  // - headerIds: Use marked-gfm-heading-id plugin if needed (optional)
  // - mangle: Disabled by default in v9+
  // - sanitize: Use DOMPurify instead (which we do)
});

// ✅ Parse markdown to safe HTML
export function parseMarkdownToHtml(markdown: string): string {
  // Parse markdown to HTML
  const rawHtml = marked.parse(markdown) as string;
  
  // Sanitize HTML to prevent XSS
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['target'], // Allow target attribute for links
    FORCE_BODY: true, // Ensure output is a fragment, not full document
  });
  
  return cleanHtml;
}

// ✅ Optional: Extract headings for Table of Contents
// (This generates IDs manually since marked v9+ doesn't auto-add them)
export function extractHeadings(markdown: string): Array<{ level: number; text: string; id: string }> {
  const headings: Array<{ level: number; text: string; id: string }> = [];
  
  // Simple regex to find markdown headings
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    // Generate ID same way as TOC component expects
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    headings.push({ level, text, id });
  }
  
  return headings;
}