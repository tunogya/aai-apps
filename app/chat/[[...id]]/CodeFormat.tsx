"use client";
import { FC, useEffect, useRef, useState } from "react";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import copy from "copy-to-clipboard";
import hljs from "highlight.js";

const CodeFormat: FC<CodeProps> = ({
  className,
  inline,
  children,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || "");
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && children) {
      // @ts-ignore
      ref.current.innerHTML = hljs.highlightAuto(String(children)).value;
    }
  }, [ref, children]);

  if (!inline) {
    return (
      <div className={"bg-black rounded-md mb-4"}>
        <div className="flex items-center relative text-white bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
          <span>{match?.[1]}</span>
          <button
            className="flex ml-auto gap-2"
            onClick={() => {
              copy(String(children));
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 1_000);
            }}
          >
            {copied ? (
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            )}
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>
        <div className={"p-4 overflow-y-auto"}>
          <code
            className={`!whitespace-pre hljs text-sm ${className}`}
            {...props}
            ref={ref}
          />
        </div>
      </div>
    );
  } else {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }
};

export default CodeFormat;
