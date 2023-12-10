"use client";

import { useChat } from "ai/react";
import React, { useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { BoltIcon, SparklesIcon, StopIcon } from "@heroicons/react/24/solid";
import { useLocalStorage } from "@uidotdev/usehooks";
import { functions, functionCallHandler } from "@/app/utils/functions";
import MobileDrawer from "@/app/chat/[[...id]]/MobileDrawer";
import dynamic from "next/dynamic";
import dysortid from "@/app/utils/dysortid";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

const MessageBox = dynamic(() => import("@/app/chat/[[...id]]/MessageBox"));

export default function Chat() {
  const params = useParams();
  const currentChatId = useMemo(() => {
    if (params?.id?.[0]) {
      return params?.id?.[0];
    } else {
      return dysortid();
    }
  }, [params?.id]);
  const { data } = useSWR(`/api/conversation/${currentChatId}`, (url) =>
    fetch(url).then((res) => res.json()),
  );
  const inputRef = useRef(null);
  const [model, setModel] = useLocalStorage("chat-model", "gpt-3.5-turbo");
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "/api/chat",
      id: currentChatId,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        id: currentChatId,
        model: model,
        functions: functions,
      },
      initialMessages: data ? data?.item?.messages : [],
      experimental_onFunctionCall: functionCallHandler,
    });
  const isPurple = model.startsWith("gpt-4");
  const router = useRouter();

  useEffect(() => {
    if (!params?.id?.[0] && currentChatId) {
      router.replace(`/chat/${currentChatId}`);
    }
  }, [params, currentChatId, router]);

  const tips = useMemo(() => {
    if (!isLoading) {
      return "Generating content";
    }
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "assistant" && !lastMessage.content) {
      return `Prepare ${lastMessage.name}`;
    }
    if (lastMessage.role === "function") {
      return `Running ${lastMessage.name}`;
    }
    return "Generating content";
  }, [messages, isLoading]);

  return (
    <div className={"w-full min-w-[100vw] md:min-w-[400px] shrink-0"}>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
          if (inputRef.current) {
            // @ts-ignore
            inputRef.current.style.height = "auto";
          }
        }}
      >
        <div
          className={"p-2 md:pb-4 w-full md:px-8 xl:px-20 flex justify-center"}
        >
          <div className={"flex w-full max-w-3xl pl-10 md:pl-0"}>
            <div className={"w-full flex gap-2"}>
              <div
                className={`border ${
                  isPurple
                    ? "border-[#AB68FF] ring-[#AB68FF] ring-1"
                    : "border-gray-200"
                } flex rounded md:rounded w-full px-3 py-1.5 md:py-3 md:px-5 text-gray-800 bg-white items-end gap-2`}
              >
                {isLoading ? (
                  <div
                    className={
                      "w-full text-gray-500 outline-none text-sm md:text-base focus:outline-none focus:bg-transparent max-h-52 min-h-6 overflow-y-auto resize-none"
                    }
                  >
                    {tips}
                  </div>
                ) : (
                  <textarea
                    value={input}
                    className={
                      "w-full outline-none text-sm md:text-base focus:outline-none focus:bg-transparent max-h-52 min-h-6 overflow-y-auto resize-none"
                    }
                    ref={inputRef}
                    maxLength={isPurple ? undefined : 2048}
                    rows={1}
                    onChange={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                      handleInputChange(e);
                    }}
                    placeholder={isPurple ? "Message GPT-4" : "Message GPT-3.5"}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        if (e.nativeEvent.isComposing) return;
                        e.preventDefault();
                        handleSubmit(e as any);
                        if (inputRef.current) {
                          // @ts-ignore
                          inputRef.current.style.height = "auto";
                        }
                      } else if (e.key === "Enter" && e.shiftKey) {
                        if (inputRef.current) {
                          // @ts-ignore
                          inputRef.current.style.height = "auto";
                          // @ts-ignore
                          inputRef.current.style.height =
                            // @ts-ignore
                            e.target.scrollHeight + "px";
                        }
                      }
                    }}
                  />
                )}
                <button
                  type={isLoading ? "button" : "submit"}
                  onClick={isLoading ? stop : undefined}
                  className={`h-6 w-6 items-center hidden md:flex justify-center rounded`}
                >
                  {isLoading ? (
                    <StopIcon className={"w-6 h-6 stroke-2"} />
                  ) : (
                    <ArrowUpIcon
                      className={`w-6 h-6 stroke-2 p-1 text-white rounded ${
                        isPurple ? "bg-[#AB68FF]" : "bg-gray-800"
                      } `}
                    />
                  )}
                </button>
              </div>
              <div
                className={
                  "flex w-9 h-9 items-center justify-center shrink-0 md:hidden"
                }
              >
                {isLoading ? (
                  <button
                    className={`p-2 bg-gray-800 text-white rounded-full`}
                    onClick={stop}
                  >
                    <StopIcon className={"w-5 h-5 stroke-2"} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`p-2 ${
                      isPurple ? "bg-[#AB68FF]" : "bg-gray-800"
                    } rounded-full text-white`}
                  >
                    <ArrowUpIcon className={"w-5 h-5 stroke-2"} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
      <div
        className={
          "h-[calc(100vh-85px)] md:h-[calc(100vh-134px)] w-full overflow-y-auto relative"
        }
      >
        {messages.length > 0 ? (
          <MessageBox
            messages={messages}
            currentChatId={currentChatId}
            isLoading={isLoading}
            isPurple={isPurple}
          />
        ) : (
          <div
            className={`${
              isPurple ? "text-[#AB68FF]" : "text-gray-800"
            } w-full h-full flex items-center justify-center text-3xl md:text-4xl font-semibold pb-52`}
          >
            {!isPurple ? (
              <BoltIcon className={"w-10 h-10"} />
            ) : (
              <SparklesIcon className={"w-10 h-10"} />
            )}
            ChatGPT
          </div>
        )}
      </div>
      <div className={"absolute z-50 bottom-0 bg-white w-full md:hidden"}>
        <MobileDrawer />
      </div>
    </div>
  );
}
