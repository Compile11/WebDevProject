import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

{
  /*
  Easily implementable Markdown,
  <MarkdownPost content = {whatever}
*/
}
export default function MarkdownPost({ content, compact = false }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setIsDark(isDark)
    }

    updateTheme();

    window.addEventListener("themeChange", updateTheme)
    window.addEventListener("storage", updateTheme)

    return () => {
    window.addEventListener("themeChange", updateTheme)
      window.removeEventListener("storage", updateTheme)
    }
  }, [])

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          {
            /*
            Extracting input language for color coding purposes, 
            completely visual but it looks nice, if you care about that
          */
          }
          const match = /language-(\w+)/.exec(className || "");

          if (!inline && match) {
            return (
              <div className={compact ? "relative" : ""}>
                <SyntaxHighlighter
                  style={isDark ? oneDark : oneLight}
                  language={match[1]}
                  PreTag="div"
                  customStyle={
                    compact
                      ? {
                        maxHeight: "100px",
                        overflow: "hidden",
                      }
                      : {}
                  }
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>

                {/* Fade at bottom of clamped code + ellipses */}
                {compact && (
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#222428] dark:via-[#222428]/80 dark:to-[#222428]/0 flex justify-center items-end">
                    <span className="ml-2 mb-1 text-gray-500 text-lg font-sans">
                      . . .
                    </span>
                  </div>
                )}
              </div>
            );
          }
          return (
            // Default colors when no language is detected
            <code
              className="bg-gray-700 px-1 py-0.5 rounded text-sm"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
}
