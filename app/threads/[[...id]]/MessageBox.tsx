import React, { FC, useMemo } from "react";
import { ThreadMessage } from "openai/src/resources/beta/threads/messages/messages";
import Link from "next/link";

const MessageBox: FC<{
  message: ThreadMessage;
}> = ({ message }) => {
  const isTelegram = useMemo(() => {
    return (
      // @ts-ignore
      message.metadata?.["Content-Type"] === "application/json" &&
      // @ts-ignore
      message.metadata?.Type === "telegram/update"
    );
  }, [message]);

  const username = useMemo(() => {
    if (isTelegram) {
      // @ts-ignore
      return JSON.parse(message.content[0]?.text.value).message.from.username;
    } else {
      return "user";
    }
  }, [isTelegram, message.content]);

  return (
    <div
      className={`border-b p-5 flex justify-center ${
        message?.role === "user" ? "bg-gray-50" : ""
      }`}
    >
      <div className={"flex flex-col w-full max-w-3xl"}>
        <div className={"text-sm text-gray-500 flex justify-between mb-1"}>
          {isTelegram ? (
            <Link href={`https://t.me/${username}`} target={"_blank"}>
              @{username}
            </Link>
          ) : (
            <div>{message?.role}</div>
          )}
          <div className={"text-gray-400 text-[13px]"}>
            {new Date(message?.created_at * 1000).toLocaleString()}
          </div>
        </div>
        {message.content?.[0].type === "text" &&
          (isTelegram ? (
            <div
              className={"text-gray-600 break-words flex gap-1 items-center"}
            >
              {JSON.parse(message.content[0].text.value).message.text}
            </div>
          ) : (
            <div className={"text-gray-600 break-words"}>
              {message.content[0].text.value}
            </div>
          ))}
        {message.content?.[0].type === "image_file" && (
          <div className={"text-gray-600 break-words"}>
            file_id: {message.content[0].image_file.file_id}
          </div>
        )}
        {message?.run_id && (
          <div
            className={
              "text-xs border px-2 py-1 text-gray-800 w-fit rounded mt-2 bg-gray-100"
            }
          >
            run_id: {message.run_id}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
