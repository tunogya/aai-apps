"use client";
import React, { FC } from "react";
import { Message } from "ai";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import { Disclosure } from "@headlessui/react";
import CodePreview from "@/app/components/CodePreview";

const MessageBox: FC<{
  message: Message;
  index: number;
  isGPT4: boolean;
  isLoading: boolean;
  isLast: boolean;
}> = ({ message, isGPT4, isLoading, isLast }) => {
  return (
    <div
      className={`flex border-t p-3 md:p-8 bg-gray-50 items-center justify-center group`}
    >
      <div className={`max-w-3xl w-full h-fit flex gap-3 items-start`}>
        <div className={"shrink-0"}>
          <div
            className={`w-6 h-6 my-1 md:my-0 md:w-8 md:h-8 ${
              isGPT4 ? "bg-[#AB68FF]" : "bg-[#19C37D]"
            } text-white flex items-center justify-center rounded-full md:rounded-none`}
          >
            <CodeBracketIcon className={"w-4 h-4 md:w-5 md:h-5 stroke-1.5"} />
          </div>
        </div>
        <div className={"space-y-2 w-full overflow-x-hidden"}>
          <Disclosure>
            <Disclosure.Button
              className={"bg-gray-100 px-3 h-6 md:h-8 rounded-md text-sm"}
            >
              {message.name}
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              <CodePreview rest={""} match={"json"}>
                {message.content}
              </CodePreview>
            </Disclosure.Panel>
          </Disclosure>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
