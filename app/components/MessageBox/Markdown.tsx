"use client";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import CodePreview from "@/app/components/CodePreview";
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";

const Markdown: FC<{
  content: string;
  isLoading: boolean;
}> = ({ content, isLoading }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code(props) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <CodePreview match={match} rest={rest}>
              {children}
            </CodePreview>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
      className={`${
        isLoading ? "result-streaming" : ""
      } markdown prose w-full overflow-x-hidden break-words leading-8`}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
