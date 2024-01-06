import React, { FC, useMemo } from "react";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";

const MessageBox: FC<{
  message: any;
}> = ({ message }) => {
  const isTelegram = useMemo(() => {
    return message.metadata?.object === "telegram.update";
  }, [message]);

  const username = useMemo(() => {
    if (isTelegram) {
      // @ts-ignore
      return JSON.parse(message.content[0]?.text.value).message.from.username;
    } else {
      return "user";
    }
  }, [isTelegram, message.content]);

  if (isTelegram && !JSON.parse(message.content[0].text.value)?.message?.text) {
    return <></>;
  }

  return (
    <div
      className={`border-b p-5 flex justify-center ${
        message?.role === "user" ? "bg-gray-50" : ""
      }`}
    >
      <div className={"flex flex-col w-full max-w-3xl"}>
        <div className={"text-sm text-gray-500 flex justify-between mb-1"}>
          <div className={"flex items-center justify-center"}>
            {isTelegram ? (
              <Link
                href={`https://t.me/${username}`}
                target={"_blank"}
                className={"hover:underline"}
              >
                @{username}
              </Link>
            ) : (
              <div>{message?.role}</div>
            )}
            {message?.run_id && (
              <CheckIcon className={"w-4 h-4 mx-2 stroke-2 text-green-500"} />
            )}
          </div>
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
      </div>
    </div>
  );
};

export default MessageBox;
