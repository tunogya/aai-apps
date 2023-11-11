"use client";
import Link from "next/link";
import React, { FC } from "react";
import { useSearchParams } from "next/navigation";

const SecondaryNavItem: FC<{
  item: any;
  currentChatId: any;
  deleteItems: any;
  setDeleteItems: any;
  deleteChat: any;
}> = ({ item, currentChatId, deleteItems, setDeleteItems, deleteChat }) => {
  const searchParams = useSearchParams();

  return (
    <div
      key={item.SK}
      className={`relative flex group items-center gap-2 ${
        item.SK.replace("CHAT2#", "") === currentChatId ? "bg-gray-100" : ""
      } hover:bg-gray-100 text-gray-800 rounded px-3 py-2 cursor-pointer select-none`}
    >
      <Link
        href={`/chat/${item.SK.replace("CHAT2#", "")}?model=${
          searchParams.get("model") || "gpt-3.5-turbo"
        }`}
        prefetch
        className={`flex w-full items-center ${
          deleteItems.includes(item.SK) ? "line-through text-red-500" : ""
        }`}
      >
        <div className={"w-6 shrink-0"}>
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div className={`truncate text-sm mr-4`}>{item.title}</div>
      </Link>
      {!deleteItems.includes(item.SK) && (
        <button
          className={`absolute right-2 hidden group-hover:flex text-gray-800 hover:text-red-500 ${
            deleteItems.includes(item.SK) ? "text-red-500" : ""
          }`}
          onClick={async () => {
            const _newDeleteItems = [...deleteItems, item.SK];
            setDeleteItems(_newDeleteItems);
            sessionStorage.setItem(
              "deleteItems",
              JSON.stringify(_newDeleteItems),
            );
            await deleteChat(item.SK.replace("CHAT2#", ""));
          }}
        >
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

export default SecondaryNavItem;
