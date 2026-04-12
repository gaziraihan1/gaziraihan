'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

interface ProjectMarkdownProps {
  content: string;
}

export function ProjectMarkdown({ content }: ProjectMarkdownProps) {
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-lg border border-white/10 bg-[#0a0a0a]! my-6!"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            );
          },
          h1: (props) => <h1 className="text-3xl font-bold text-white mt-12 mb-6" {...props} />,
          h2: (props) => <h2 className="text-2xl font-bold text-white mt-10 mb-4" {...props} />,
          h3: (props) => <h3 className="text-xl font-semibold text-white mt-8 mb-3" {...props} />,
          p: (props) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
          ul: (props) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />,
          ol: (props) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />,
          blockquote: (props) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-400 my-6" {...props} />
          ),
          img: (props) => (
            < Image
              src={props.src as string}
              alt={props.alt || 'Project image'}
              className="w-full h-64 md:h-96 my-8 rounded-lg object-cover border border-white/10"
              loading="lazy"
              fetchPriority='high'
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}