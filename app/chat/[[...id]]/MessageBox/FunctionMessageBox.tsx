"use client";
import React, { FC, useMemo } from "react";
import { Message } from "ai";
import { ChevronDownIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { Disclosure } from "@headlessui/react";
import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton";

const Markdown = dynamic(
  () => import("@/app/chat/[[...id]]/MessageBox/Markdown"),
  {
    loading: () => <Skeleton count={5} height={"28px"} />,
  },
);

const MessageBox: FC<{
  message: Message;
  index: number;
  isGPT4: boolean;
  isLoading: boolean;
  isLast: boolean;
}> = ({ message, isGPT4, isLoading, isLast }) => {
  const markdownCode = useMemo(() => {
    const jsonStr = message.content;
    try {
      const jsonObj = JSON.parse(jsonStr);
      return "```json\n" + JSON.stringify(jsonObj, null, 2) + "\n```";
    } catch (e) {
      return jsonStr;
    }
  }, [message.content]);

  return (
    <div
      className={`flex border-t p-3 md:p-8 bg-white items-center justify-center group`}
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
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={
                    "bg-gray-100 px-3 h-6 md:h-8 rounded-md text-sm flex items-center justify-between gap-2 border"
                  }
                >
                  <div>Function call response ({message.name})</div>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-gray-800 ${
                      open ? "" : "rotate-180 transform"
                    }`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="text-gray-500">
                  <Markdown
                    content={markdownCode}
                    isLoading={isLoading && isLast}
                  />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
