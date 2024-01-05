"use client";
import Link from "next/link";
import { FC } from "react";

const LogItem: FC<{
  log: any;
}> = ({ log }) => {
  const thread_id = log.SK.split("#")[1];
  const chat_username = JSON.parse(log?.message)?.message?.chat?.username;
  const chat_type = JSON.parse(log?.message)?.message?.chat?.type;
  const from_username = JSON.parse(log?.message)?.message?.from?.username;
  const text = JSON.parse(log?.message)?.message?.text || "NaN";
  const updated = new Date(log.updated * 1000).toLocaleString();

  return (
    <Link
      href={`/threads/${thread_id}`}
      prefetch={true}
      className={
        "text-sm text-gray-500 flex justify-between h-10 hover:bg-gray-50 items-center px-1 cursor-pointer border-b"
      }
    >
      <div className={"flex gap-2 items-center"}>
        <div
          className={`text-xs px-1 py-0.5 ${
            chat_type === "private"
              ? "bg-gray-200 text-gray-500"
              : "bg-green-500 text-white"
          } rounded`}
        >
          {chat_username}
        </div>
        {from_username ? `@${from_username}` : "NaN"}: {text}
      </div>
      <div className={"text-[13px]"}>{updated}</div>
    </Link>
  );
};

export default LogItem;
