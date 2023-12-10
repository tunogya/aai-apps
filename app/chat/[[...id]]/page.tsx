"use client";

import { useChat } from "ai/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { StopIcon } from "@heroicons/react/24/solid";
import { useLocalStorage } from "@uidotdev/usehooks";
import { functions, functionCallHandler } from "@/app/utils/functions";
import MobileDrawer from "@/app/chat/[[...id]]/MobileDrawer";
import dynamic from "next/dynamic";
import dysortid from "@/app/utils/dysortid";
import {
  ArrowDownTrayIcon,
  ArrowUpIcon,
  PaperClipIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Transition } from "@headlessui/react";
import Skeleton from "react-loading-skeleton";

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
        imageUrl: imageUrl,
      },
      initialMessages: data ? data?.item?.messages : [],
      experimental_onFunctionCall: functionCallHandler,
    });
  const isGPT4 = model.startsWith("gpt-4");
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState("idle");
  const onDropAccepted = useCallback((acceptedFiles: any) => {
    // Do something with the files
    console.log(acceptedFiles);
    setUploadStatus("loading");
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
    acceptedFiles,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDropAccepted,
    noClick: true,
    noDrag: !isGPT4,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  useEffect(() => {
    if (!params?.id?.[0] && currentChatId) {
      router.replace(`/chat/${currentChatId}`);
    }
  }, [params, currentChatId, router]);

  const tips = useMemo(() => {
    if (!isLoading) {
      return "Generating...";
    }
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "assistant" && !lastMessage.content) {
      return `Prepare ${lastMessage.name}...`;
    }
    if (lastMessage.role === "function") {
      return `Running ${lastMessage.name}...`;
    }
    return "Generating...";
  }, [messages, isLoading]);

  return (
    <div
      className={"w-full min-w-[100vw] md:min-w-[400px] shrink-0 relative"}
      {...getRootProps()}
    >
      <Transition
        show={isDragActive}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={
            "absolute bg-gray-50 w-full h-[calc(100vh-80px)] md:h-[calc(100vh-60px)] p-4 z-10 border-t"
          }
        >
          <div
            className={
              "w-full h-full border-4 border-dashed border-[#AB68FF] text-[#AB68FF] flex flex-col items-center justify-center rounded-lg gap-3"
            }
          >
            <ArrowDownTrayIcon className={"w-10 h-10"} />
            <div>Drag and drop files</div>
          </div>
        </div>
      </Transition>
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
                  isGPT4
                    ? "border-[#AB68FF] ring-[#AB68FF] ring-1"
                    : "border-gray-200"
                } flex rounded md:rounded w-full px-3 py-1.5 md:py-3 md:px-5 text-gray-800 bg-white items-end gap-3`}
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
                  <div className={"w-full flex flex-col gap-2"}>
                    <textarea
                      value={input}
                      className={
                        "w-full outline-none text-sm md:text-base focus:outline-none focus:bg-transparent max-h-52 min-h-6 overflow-y-auto resize-none"
                      }
                      ref={inputRef}
                      maxLength={isGPT4 ? undefined : 2048}
                      rows={1}
                      onChange={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                        handleInputChange(e);
                      }}
                      placeholder={
                        isGPT4 ? "Message GPT-4 ..." : "Message GPT-3.5 ..."
                      }
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
                    {uploadStatus === "loading" && acceptedFiles.length > 0 && (
                      <div className={"h-fit w-full relative"}>
                        <div
                          className={
                            "absolute top-2 right-2 text-gray-400 text-xs z-20"
                          }
                        >
                          uploading...
                        </div>
                        <Skeleton className={"w-full h-24 z-10"} />
                      </div>
                    )}
                    {imageUrl && (
                      <div className={"h-fit w-full py-1 relative"}>
                        <button
                          onClick={() => {}}
                          className={
                            "absolute top-2 right-2 text-gray-800 hover:text-red-500"
                          }
                        >
                          <XCircleIcon className={"w-5 h-5"} />
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={"images"}
                          className={
                            "w-full max-h-24 object-contain border rounded-lg"
                          }
                        />
                      </div>
                    )}
                  </div>
                )}
                {isGPT4 && (
                  <button
                    onClick={open}
                    className={`h-6 w-6 items-center flex justify-center`}
                  >
                    <PaperClipIcon className={"w-5 h-5 text-gray-600"} />
                  </button>
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
                        isGPT4 ? "bg-[#AB68FF]" : "bg-gray-800"
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
                    <StopIcon className={"w-4 h-4 stroke-2"} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`p-2 ${
                      isGPT4 ? "bg-[#AB68FF]" : "bg-gray-800"
                    } rounded-full text-white`}
                  >
                    <ArrowUpIcon className={"w-4 h-4 stroke-2"} />
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
            isGPT4={isGPT4}
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center text-xl md:text-2xl lg:text-3xl pb-40 gap-3 text-gray-800`}
          >
            <div className={"p-3 border rounded-full"}>
              <Image src={"/favicon.svg"} alt={""} height={40} width={40} />
            </div>
            <div>abandon.ai</div>
          </div>
        )}
      </div>
      <div className={"absolute z-50 bottom-0 bg-white w-full md:hidden"}>
        <MobileDrawer />
      </div>
    </div>
  );
}
