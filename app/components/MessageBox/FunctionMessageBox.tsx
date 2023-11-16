"use client";
import React, { FC, useState } from "react";
import { Message } from "ai";
import { CodeBracketIcon } from "@heroicons/react/24/outline";

const MessageBox: FC<{
  message: Message;
  index: number;
  isPurple: boolean;
  isLoading: boolean;
  isLast: boolean;
}> = ({ message, isPurple, isLoading, isLast }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className={`flex border-t p-3 md:p-8 ${
        message.role === "user" ? "bg-white" : "bg-gray-50"
      } items-center justify-center group`}
    >
      <div className={`max-w-3xl w-full h-fit flex gap-3 items-start`}>
        <div className={"shrink-0"}>
          <div
            className={`w-6 h-6 my-1 md:my-0 md:w-8 md:h-8 ${
              isPurple ? "bg-[#AB68FF]" : "bg-[#19C37D]"
            } text-white flex items-center justify-center rounded-full md:rounded-none`}
          >
            <CodeBracketIcon className={"w-4 h-4 md:w-5 md:h-5 stroke-1.5"} />
          </div>
        </div>
        <div className={"space-y-2 w-full overflow-x-hidden"}>
          <button
            disabled={isLoading && isLast}
            className={"bg-gray-200 px-3 h-6 md:h-8 rounded-md text-sm"}
            onClick={() => {
              setShow(!show);
            }}
          >
            {isLoading && isLast
              ? "Running..."
              : show
              ? "Hidden result"
              : "Show result"}
          </button>
          {show && <div className={"text-gray-700"}>{message.content}</div>}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
