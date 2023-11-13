"use client";
import Link from "next/link";
import React, { FC } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useDeleteItems from "@/app/hooks/useDeleteItems";
import { TrashIcon } from "@heroicons/react/24/outline";

const SecondaryNavItem: FC<{
  item: any;
}> = ({ item }) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { deleteItems, deleteById } = useDeleteItems();
  const currentChatId = params?.id?.[0] || null;

  const deleteChat = async (id: string) => {
    if (id === currentChatId) {
      router.replace("/chat");
    }
    try {
      await fetch(`/api/conversation/${id}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      key={item.SK}
      className={`relative flex group items-center gap-2 ${
        item.SK.replace("CHAT2#", "") === currentChatId ? "bg-gray-100" : ""
      } hover:bg-gray-100 text-gray-800 rounded px-3 py-2 cursor-pointer select-none ${
        deleteItems.includes(item.SK) ? "hidden" : ""
      }`}
    >
      <Link
        href={`/chat/${item.SK.replace("CHAT2#", "")}?model=${
          searchParams.get("model") || "gpt-3.5-turbo"
        }`}
        prefetch
        className={`flex w-full items-center`}
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
            deleteById(item.SK);
            await deleteChat(item.SK.replace("CHAT2#", ""));
          }}
        >
          <TrashIcon className={"w-4 h-4 stroke-2"} />
        </button>
      )}
    </div>
  );
};

export default SecondaryNavItem;
