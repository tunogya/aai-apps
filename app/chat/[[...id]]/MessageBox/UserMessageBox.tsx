"use client";
import Image from "next/image";
import moment from "moment";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowPathIcon,
  CheckIcon,
  ClipboardIcon,
  CloudArrowDownIcon,
  ExclamationTriangleIcon,
  MusicalNoteIcon,
  PauseCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import copy from "copy-to-clipboard";
import { Message } from "ai";
import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { useSessionStorage } from "@uidotdev/usehooks";

const Markdown = dynamic(
  () => import("@/app/chat/[[...id]]/MessageBox/Markdown"),
  {
    loading: () => <Skeleton count={3} height={"28px"} />,
  },
);

const MessageBox: FC<{
  currentChatId: string;
  message: Message;
  index: number;
  picture: string | null | undefined;
}> = ({ message, index, picture, currentChatId }) => {
  const [state, setState] = useState(false);
  const [speechState, setSpeechState] = useState("ended");
  const [deleteItems, setDeleteItems] = useSessionStorage(
    "deleteItems",
    [] as string[],
  );
  const audio = useRef(new Audio());
  const [url, setUrl] = useState("");
  const content = useMemo(() => {
    try {
      const parseContent = JSON.parse(message.content);
      if (
        Array.isArray(parseContent) &&
        parseContent.length > 0 &&
        parseContent[0]?.type
      ) {
        return parseContent;
      }
      return [
        {
          type: "text",
          text: message.content,
        },
      ];
    } catch (e) {
      return [
        {
          type: "text",
          text: message.content,
        },
      ];
    }
  }, [message.content]);

  useEffect(() => {
    audio.current.addEventListener("playing", () => {
      setSpeechState("playing");
    });
    audio.current.addEventListener("pause", () => {
      setSpeechState("pause");
    });
    audio.current.addEventListener("ended", () => {
      setSpeechState("ended");
    });
    audio.current.addEventListener("error", () => {
      setSpeechState("error");
    });

    return () => {
      audio.current.removeEventListener("playing", () => {
        setSpeechState("playing");
      });
      audio.current.removeEventListener("pause", () => {
        setSpeechState("pause");
      });
      audio.current.removeEventListener("ended", () => {
        setSpeechState("ended");
      });
      audio.current.removeEventListener("error", () => {
        setSpeechState("error");
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audio.current.pause();
    };
  }, []);

  const speech = async (input: string) => {
    setSpeechState("loading");
    const res = await fetch("/api/audio/speech", {
      method: "POST",
      body: JSON.stringify({
        model: "tts-1",
        input,
        voice: "onyx",
        response_format: "opus",
        speed: "1.0",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    setUrl(res.url);
    audio.current.src = res.url;
    await audio.current.play();
  };

  const isHidden = useMemo(() => {
    return deleteItems.includes(message.id);
  }, [deleteItems, message.id]);

  return (
    <div
      className={`flex border-t p-3 md:p-8 bg-white ${
        isHidden ? "hidden" : ""
      } items-center justify-center group`}
    >
      <div className={`max-w-3xl w-full h-fit flex gap-3 items-start`}>
        <div className={"shrink-0"}>
          {picture && (
            <Image
              src={picture!}
              alt={""}
              width={32}
              height={32}
              className={
                "rounded-full md:rounded-none w-6 h-6 md:w-8 md:h-8 my-1 md:my-0"
              }
              priority
            />
          )}
        </div>
        <div className={"md:space-y-1 w-full overflow-x-hidden"}>
          <div
            className={
              "flex items-center text-xs text-gray-500 justify-between"
            }
          >
            <div>
              {moment(message?.createdAt)
                .startOf("second")
                .fromNow()}
            </div>
            <div className={"group-hover:opacity-100 opacity-0 space-x-1 flex"}>
              {url && (
                <Link href={url} target={"_blank"}>
                  <div
                    className={"rounded p-1 hover:bg-gray-100 cursor-pointer"}
                  >
                    <CloudArrowDownIcon className={"w-4 h-4 stroke-2"} />
                  </div>
                </Link>
              )}
              <button
                onClick={async () => {
                  if (speechState === "ended") {
                    await speech(message.content);
                  } else if (speechState === "playing") {
                    audio.current.pause();
                    setSpeechState("pause");
                  } else if (speechState === "pause") {
                    await audio.current.play();
                    setSpeechState("playing");
                  }
                }}
                className={
                  "rounded p-1 hover:bg-gray-100 cursor-pointer w-6 h-6"
                }
              >
                {(speechState === "ended" || speechState === "pause") && (
                  <MusicalNoteIcon className={"w-4 h-4 stroke-2"} />
                )}
                {speechState === "playing" && (
                  <PauseCircleIcon className={"w-4 h-4 stroke-2"} />
                )}
                {speechState === "loading" && (
                  <ArrowPathIcon className={"w-4 h-4 stroke-2 animate-spin"} />
                )}
                {speechState === "error" && (
                  <ExclamationTriangleIcon className={"w-4 h-4 stroke-2"} />
                )}
              </button>
              <button
                onClick={() => {
                  copy(message.content);
                  setState(true);
                  setTimeout(() => {
                    setState(false);
                  }, 2_000);
                }}
                className={"rounded p-1 hover:bg-gray-100 cursor-pointer"}
              >
                {state ? (
                  <CheckIcon className={"w-4 h-4 stroke-2"} />
                ) : (
                  <ClipboardIcon className={"w-4 h-4 stroke-2"} />
                )}
              </button>
              <button
                onClick={async () => {
                  try {
                    setDeleteItems([...deleteItems, message.id]);
                    await fetch(`/api/conversation/${currentChatId}`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        UpdateExpression: `REMOVE #messages[${index}]`,
                        ConditionExpression: `#messages[${index}].#id = :id`,
                        ExpressionAttributeNames: {
                          "#messages": "messages",
                          "#id": "id",
                        },
                        ExpressionAttributeValues: {
                          ":id": message.id,
                        },
                      }),
                    });
                  } catch (e) {
                    console.log(e);
                  }
                }}
                className={"rounded p-1 hover:bg-gray-100 cursor-pointer"}
              >
                <TrashIcon className={"w-4 h-4 stroke-2"} />
              </button>
            </div>
          </div>
          {content &&
            content?.map((item: any, index: number) => (
              <ShowContent item={item} key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

const ShowContent: FC<{
  item: {
    type: string;
    text?: string;
    image_url?: string;
  };
}> = ({ item }) => {
  if (item.type === "text" && item.text) {
    return <Markdown content={item.text} isLoading={false} />;
  }

  if (item.type === "image_url" && item.image_url) {
    return (
      <img
        src={item.image_url}
        alt={""}
        width={"full"}
        className={"rounded-lg"}
      />
    );
  }

  return null;
};

export default MessageBox;
