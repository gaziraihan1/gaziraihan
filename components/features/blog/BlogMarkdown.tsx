// components/features/blog/blog-markdown.tsx
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

interface BlogMarkdownProps {
  content: string;
}

export function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code Blocks
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="relative my-6">
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg border border-white/10 bg-[#0a0a0a]! my-0!"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
                <div className="absolute top-4 right-4 text-xs text-gray-500">
                  {match[1]}
                </div>
              </div>
            ) : (
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            );
          },
          // Headings with IDs for TOC
          h1: (props) => (
            <h1 id={props.children?.toString()} className="text-3xl font-bold text-white mt-12 mb-6 scroll-mt-24" {...props} />
          ),
          h2: (props) => (
            <h2 id={props.children?.toString()} className="text-2xl font-bold text-white mt-10 mb-4 scroll-mt-24" {...props} />
          ),
          h3: (props) => (
            <h3 id={props.children?.toString()} className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24" {...props} />
          ),
          p: (props) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
          ul: (props) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />,
          ol: (props) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />,
          blockquote: (props) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-400 my-6 bg-white/5 py-4 pr-4 rounded-r-lg" {...props} />
          ),
          img: (props) => (
            <div className="relative w-full h-64 md:h-96 my-8 rounded-lg overflow-hidden border border-white/10">
              <Image src={props.src || ''} alt={props.alt || ''} fill className="object-cover" />
            </div>
          ),
          a: (props) => (
            <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}