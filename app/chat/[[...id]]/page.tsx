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
import dynamic from "next/dynamic";
import dysortid from "@/app/utils/dysortid";
import {
  ArrowDownTrayIcon,
  ArrowUpIcon,
  PaperClipIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Transition } from "@headlessui/react";
import { sha256 } from "multiformats/hashes/sha2";
import { CID } from "multiformats/cid";
import * as raw from "multiformats/codecs/raw";
import Link from "next/link";
import ErrorMessageBox from "@/app/chat/[[...id]]/MessageBox/ErrorMessageBox";

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
  const [model, setModel] = useLocalStorage("chat-model", "gpt-3.5");
  const [files, setFiles] = useState<
    {
      cid: string;
      base64Url: string;
      imageUrl?: string;
    }[]
  >([]);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const { messages, handleSubmit, isLoading, stop, setInput } = useChat({
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
    onError: (error) => {
      setFiles([]);
      setText("");
      // @ts-ignore
      setError(error.toString());
    },
    onFinish: () => {
      setFiles([]);
      setText("");
      setError("");
    },
  });
  const useGPT4 = model.startsWith("gpt-4");
  const useVision = model === "gpt-4-vision";
  const router = useRouter();
  const onDropAccepted = useCallback(async (acceptedFiles: File[]) => {
    for (const item of acceptedFiles) {
      const reader = new FileReader();
      reader.readAsDataURL(item);
      reader.onload = async () => {
        const imageUrl = reader.result as string;
        const buffer = await item.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        const hash = await sha256.digest(uint8Array);
        const cid = CID.create(1, raw.code, hash).toString();
        setFiles((prev) => [
          ...prev,
          {
            cid: cid,
            base64Url: imageUrl,
            imageUrl: undefined,
          },
        ]);
        // upload image to s3, use formData
        const formData = new FormData();
        formData.append("file", item);
        try {
          const res = await fetch(`/api/files`, {
            method: "POST",
            body: formData,
          }).then((res) => res.json());
          setFiles((prev) =>
            prev.map((item) => {
              if (item.cid === cid) {
                return {
                  ...item,
                  imageUrl: res.url,
                };
              }
              return item;
            }),
          );
        } catch (e) {
          console.log(e);
        }
      };
    }
  }, []);
  const { getRootProps, isDragActive, open } = useDropzone({
    onDropAccepted,
    noClick: true,
    noKeyboard: true,
    autoFocus: false,
    noDrag: !useVision,
    accept: {
      "image/*": [],
    },
    maxSize: 5 * 1024 * 1024,
  });

  useEffect(() => {
    if (!params?.id?.[0] && currentChatId) {
      router.replace(`/chat/${currentChatId}`);
    }
  }, [params, currentChatId, router]);

  useEffect(() => {
    if (files.length > 0) {
      const content = [];
      if (text) {
        content.push({
          type: "text",
          text: text,
        });
      }
      for (const item of files) {
        if (item.imageUrl) {
          content.push({
            type: "image_url",
            image_url: item.imageUrl,
          });
        }
      }
      setInput(JSON.stringify(content));
    } else {
      setInput(text);
    }
  }, [text, files]);

  const hasUploaded = useMemo(() => {
    return files.every((item) => item.imageUrl);
  }, [files]);

  const tips = useMemo(() => {
    if (!isLoading) {
      return "Generating...";
    }
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" && !lastMessage?.content) {
      return `Prepare ${lastMessage.name}...`;
    }
    if (lastMessage?.role === "function") {
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
            "absolute bg-gray-50 w-full h-[calc(100vh-80px)] md:h-[calc(100vh-60px)] p-4 z-50 border-t"
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
          setText("");
          setFiles([]);
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
          <div className={"flex w-full max-w-3xl"}>
            <div className={"w-full flex gap-2"}>
              <div
                className={`border ${
                  useGPT4
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
                      value={text}
                      className={
                        "w-full outline-none text-sm md:text-base focus:outline-none focus:bg-transparent max-h-52 min-h-6 overflow-y-auto resize-none"
                      }
                      ref={inputRef}
                      maxLength={useGPT4 ? 2048 : 1024}
                      rows={1}
                      onChange={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                        setText(e.target.value);
                      }}
                      placeholder={
                        useGPT4
                          ? useVision
                            ? "Message GPT-4 with Vision"
                            : "Message GPT-4"
                          : "Message GPT-3.5"
                      }
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          if (e.nativeEvent.isComposing) return;
                          e.preventDefault();
                          setText("");
                          setFiles([]);
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
                    {files.length > 0 && (
                      <div
                        className={"max-h-24 flex gap-1 w-full overflow-auto"}
                      >
                        {files.map((item, index) => (
                          <div
                            className={`w-fit relative group ${
                              item?.imageUrl ? "" : "animate-pulse scale-75"
                            }`}
                            key={index}
                          >
                            <button
                              onClick={() => {
                                setFiles(files.filter((_, i) => i !== index));
                              }}
                              className={
                                "absolute w-full h-full group-hover:visible invisible flex justify-center items-center bg-red-200 bg-opacity-80 rounded-lg"
                              }
                            >
                              <TrashIcon
                                className={"w-5 h-5 text-red-500 stroke-2"}
                              />
                            </button>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.base64Url}
                              alt={"images"}
                              className={
                                "w-full max-h-24 object-contain rounded-lg"
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {useVision && (
                  <button
                    onClick={open}
                    className={`h-5 w-5 md:h-6 md:w-6 items-center flex justify-center`}
                  >
                    <PaperClipIcon
                      className={"w-4 h-4 md:w-5 md:h-5 text-gray-600"}
                    />
                  </button>
                )}
                <button
                  type={isLoading ? "button" : "submit"}
                  disabled={!hasUploaded}
                  onClick={isLoading ? stop : undefined}
                  className={`h-6 w-6 items-center hidden md:flex justify-center rounded disabled:opacity-50`}
                >
                  {isLoading ? (
                    <StopIcon className={"w-6 h-6 stroke-2"} />
                  ) : (
                    <ArrowUpIcon
                      className={`w-6 h-6 stroke-2 p-1 text-white rounded ${
                        useGPT4 ? "bg-[#AB68FF]" : "bg-gray-800"
                      } `}
                    />
                  )}
                </button>
              </div>
              <div
                className={
                  "flex h-9 items-center justify-center shrink-0 md:hidden"
                }
              >
                {isLoading ? (
                  <button
                    className={`p-2 bg-gray-800 text-white rounded-full`}
                    onClick={stop}
                  >
                    <StopIcon className={"w-4 h-4 stroke-2"} />
                  </button>
                ) : text ? (
                  <button
                    type="submit"
                    disabled={!hasUploaded}
                    className={`p-2 ${
                      useGPT4 ? "bg-[#AB68FF]" : "bg-gray-800"
                    } rounded-full text-white disabled:opacity-50`}
                  >
                    <ArrowUpIcon className={"w-4 h-4 stroke-2"} />
                  </button>
                ) : (
                  <Link
                    href={`/chat/${dysortid()}`}
                    type="submit"
                    className={`p-2 ${
                      useGPT4 ? "bg-[#AB68FF]" : "bg-gray-800"
                    } rounded-full text-white disabled:opacity-50`}
                  >
                    <PlusIcon className={"w-4 h-4 stroke-2"} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
      <div
        className={
          "h-[calc(100vh-52px)] md:h-[calc(100vh-134px)] w-full overflow-y-auto relative"
        }
      >
        {error && <ErrorMessageBox error={error} />}
        {messages.length > 0 ? (
          <MessageBox
            messages={messages}
            currentChatId={currentChatId}
            isLoading={isLoading}
            useGPT4={useGPT4}
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center text-xl md:text-2xl lg:text-3xl gap-3 text-gray-800`}
          >
            <Image src={"/favicon.svg"} alt={""} height={40} width={40} />
            <div>abandon.ai</div>
            <div
              className={`text-xs max-w-md text-center text-white bg-red-500 px-2 py-1 my-20 mx-4 ${
                model === "gpt-4-vision" ? "opacity-100" : "opacity-0"
              }`}
            >
              When using GPT-4 with Vision, you will not be able to use
              functions such as browsing and drawing.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
