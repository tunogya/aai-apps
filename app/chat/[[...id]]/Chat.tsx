"use client";

import { useChat } from "ai/react";
import React, { useEffect, useMemo, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import { BoltIcon, SparklesIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import MessageBox from "@/components/MessageBox";

const MobileDrawer = dynamic(() => import("./MobileDrawer"), { ssr: false });

export default function Chat() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const currentChatId = useMemo(() => {
    if (params?.id?.[0]) {
      return params?.id?.[0];
    } else {
      return uuidv4();
    }
  }, [params?.id]);
  const { data } = useSWR(`/api/conversation/${currentChatId}`, (url) =>
    fetch(url).then((res) => res.json()),
  );
  const inputRef = useRef(null);
  const model = searchParams.get("model") || "gpt-3.5-turbo";
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
      },
      initialMessages: data ? data?.item?.messages : [],
    });
  const isPurple = model.startsWith("gpt-4");
  const router = useRouter();

  useEffect(() => {
    if (!params?.id?.[0] && currentChatId && model) {
      router.replace(`/chat/${currentChatId}?model=${model}`);
    }
  }, [params, currentChatId, model]);

  return (
    <div className={"w-full md:min-w-[400px]"}>
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
          className={
            "py-2 md:pb-4 w-full px-4 md:px-8 xl:px-20 flex justify-center"
          }
        >
          <div className={"flex w-full max-w-3xl gap-3"}>
            <div className={"w-full flex gap-2"}>
              <div
                className={`border ${
                  isPurple ? "border-[#AB68FF] ring-[#AB68FF] ring-1" : "shadow"
                } flex rounded-[18px] md:rounded w-full px-3 py-1.5 md:py-4 md:px-5 text-gray-800 bg-white items-end gap-2`}
              >
                {isLoading ? (
                  <div
                    className={
                      "w-full text-gray-500 outline-none text-sm md:text-base focus:outline-none focus:bg-transparent max-h-52 min-h-6 overflow-y-auto resize-none"
                    }
                  >
                    Generating ✨✨
                  </div>
                ) : (
                  <textarea
                    value={input}
                    className={
                      "w-full outline-none text-sm md:text-base focus:outline-none focus:bg-transparent max-h-52 min-h-6 overflow-y-auto resize-none"
                    }
                    ref={inputRef}
                    maxLength={2000}
                    rows={1}
                    onChange={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                      handleInputChange(e);
                    }}
                    placeholder={"Message"}
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
                  className={`h-6 w-6 items-center hidden md:flex ${
                    isPurple ? "text-[#AB68FF]" : "text-[#19C37D]"
                  } justify-center rounded`}
                >
                  {isLoading ? (
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                    </svg>
                  ) : (
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
                    className={`p-2 bg-[#0066FF] text-white rounded-full`}
                    onClick={stop}
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`p-2 ${
                      isPurple ? "bg-[#AB68FF]" : "bg-[#19C37D]"
                    } rounded-full text-white`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
      <div
        className={
          "h-[calc(100vh-85px)] md:h-[calc(100vh-142px)] w-full overflow-y-auto relative"
        }
      >
        {messages.length > 0 ? (
          <>
            {messages
              .map((message, index) => (
                <MessageBox
                  key={index}
                  message={message}
                  index={index}
                  isPurple={isPurple}
                  picture={user?.picture}
                  isLoading={isLoading}
                  length={messages.length}
                />
              ))
              .reverse()}
            <div className={"h-20 xl:hidden"}></div>
          </>
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
