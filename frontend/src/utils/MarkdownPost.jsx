import React from 'react'
import {createRoot} from 'react-dom/client'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

{/*
  Easily implementable Markdown,
  <MarkdownPost content = {whatever}
*/}
export default function MarkdownPost({ content }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          {/*
            Extracting input language for color coding purposes, 
            completely visual but it looks nice, if you care about that
          */}
          const match = /language-(\w+)/.exec(className || "");

          return !inline && match ? (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            // Default code block when no language is detected (no color)
            <code className="bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {content}
    </Markdown>
  );
}