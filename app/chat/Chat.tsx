"use client";

import { useChat } from "ai/react";
import React from "react";
import CodeFormat from "@/app/chat/CodeFormat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });
  return (
    <div className={"w-full min-w-[400px]"}>
      <div className={"h-[calc(100vh-60px)] w-full overflow-y-auto pb-40"}>
        {messages.map((m, index) => (
          <div
            key={index}
            className={`flex border-b p-8 ${
              m.role === "user" ? "bg-white" : "bg-stone-50"
            } items-center justify-center`}
          >
            <div className={`max-w-3xl w-full h-fit`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code({ ...props }) {
                    return <CodeFormat {...props} />;
                  },
                }}
                className={`${
                  m.role === "assistant" &&
                  isLoading &&
                  index === messages.length - 1
                    ? "result-streaming"
                    : ""
                } markdown prose w-full break-words dark:prose-invert light`}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div
          className={
            "absolute bottom-0 pb-8 left-0 w-full px-8 xl:px-20 flex justify-center bg-gradient-to-b from-white/10 to-white"
          }
        >
          <div
            className={
              "border flex rounded w-full p-4 shadow  max-w-3xl text-stone-800 bg-white items-end gap-2"
            }
          >
            <textarea
              value={input}
              className={
                "w-full focus:outline-0 max-h-52 min-h-6 overflow-y-auto resize-none"
              }
              maxLength={2000}
              rows={1}
              onChange={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
                handleInputChange(e);
              }}
              placeholder={"Send a message"}
            />
            <button
              type="submit"
              className={`h-6 w-6 flex items-center ${
                isLoading ? "animate-pulse" : ""
              } text-stone-800 justify-center rounded ${
                isLoading ? "cursor-wait" : "cursor-pointer"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="none"
                className="h-5 w-5"
                strokeWidth="2"
              >
                <path
                  d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
