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
  PlayPauseIcon,
  SpeakerWaveIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import copy from "copy-to-clipboard";
import useDeleteItems from "@/app/hooks/useDeleteItems";
import { Message } from "ai";
import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";

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
  const { deleteItems, deleteById } = useDeleteItems();
  const audio = useRef(new Audio());
  const [source, setSource] = useState("");

  useEffect(() => {
    audio.current.addEventListener("play", () => {
      setSpeechState("play");
    });
    audio.current.addEventListener("playing", () => {
      setSpeechState("playing");
    });
    audio.current.addEventListener("pause", () => {
      setSpeechState("pause");
    });
    audio.current.addEventListener("ended", () => {
      setSpeechState("ended");
    });

    return () => {
      audio.current.removeEventListener("play", () => {
        setSpeechState("play");
      });
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
    setSource(res.source);
    audio.current.src = res.source;
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
              {source && (
                <Link href={source} target={"_blank"}>
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
                className={"rounded p-1 hover:bg-gray-100 cursor-pointer"}
              >
                {(speechState === "ended" || speechState === "pause") && (
                  <SpeakerWaveIcon className={"w-4 h-4 stroke-2"} />
                )}
                {speechState === "playing" && (
                  <PlayPauseIcon className={"w-4 h-4 stroke-2"} />
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
                    deleteById(message.id);
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
          <Markdown content={message.content} isLoading={false} />
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
