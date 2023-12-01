"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import React, { FC } from "react";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import copy from "copy-to-clipboard";

const CodePreview: FC<{
  children: any;
  rest: any;
  match: any;
}> = ({ children, rest, match }: any) => {
  const [state, setState] = React.useState(false);
  return (
    <div className={"relative w-full"}>
      <div className={"absolute right-3 top-3 flex items-center gap-2"}>
        <button
          onClick={() => {
            copy(String(children));
            setState(true);
            setTimeout(() => {
              setState(false);
            }, 2_000);
          }}
          className={"bg-gray-100 rounded p-1 hover:bg-gray-200 cursor-pointer"}
        >
          {state ? (
            <CheckIcon className={"w-4 h-4 stroke-2"} />
          ) : (
            <ClipboardIcon className={"w-4 h-4 stroke-2"} />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        {...rest}
        PreTag="div"
        language={match[1]}
        customStyle={{
          borderRadius: "8px",
          backgroundColor: "#f3f4f6",
        }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodePreview;
