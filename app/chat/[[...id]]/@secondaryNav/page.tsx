"use client";
import useSWR, { preload } from "swr";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const SecondaryNav = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data, isLoading } = useSWR("/api/conversation", (url) =>
    fetch(url).then((res) => res.json()),
  );
  console.log(data);
  const currentChatId = params?.id?.[0] || null;
  const [deleteItems, setDeleteItems] = useState<string[]>([]);

  const deleteChat = async (id: string) => {
    try {
      await fetch(`/api/conversation/${id}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const items = JSON.parse(sessionStorage.getItem("deleteItems") || "[]");
    if (items) {
      setDeleteItems(items);
    }
  }, []);

  const handlePreload = useCallback(async () => {
    if (!data) return;
    data.items.forEach((item: any) => {
      preload(`/api/conversation/${item.SK.replace("CHAT2#", "")}`, (url) =>
        fetch(url).then((data) => data.json()),
      );
    });
  }, [data]);

  useEffect(() => {
    handlePreload();
  }, [handlePreload]);

  return (
    <div
      className={
        "w-[300px] shrink-0 h-full border-r overflow-y-auto flex flex-col"
      }
    >
      <Link
        href={`/chat?model=${searchParams.get("model") || "gpt-3.5-turbo"}`}
        className={
          "flex items-center border hover:bg-stone-100 p-3 rounded cursor-pointer select-none m-2"
        }
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <div className={"text-sm"}>New Chat</div>
      </Link>
      <div className={"h-full overflow-y-auto pl-2 pr-4"}>
        {!data && isLoading && <div className={"text-sm"}>Loading...</div>}
        {data &&
          data.items
            .filter((item: any) => !deleteItems.includes(item.SK))
            .sort((a: any, b: any) => b.updated - a.updated) // descending
            .map((item: any) => (
              <div
                key={item.SK}
                className={`group flex items-center gap-2 ${
                  item.SK.replace("CHAT2#", "") === currentChatId
                    ? "bg-stone-100"
                    : ""
                } hover:bg-stone-100 rounded px-3 py-2 cursor-pointer select-none`}
              >
                <Link
                  href={`/chat/${item.SK.replace("CHAT2#", "")}?model=${
                    searchParams.get("model") || "gpt-3.5-turbo"
                  }`}
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
                  <div className={"truncate text-sm"}>{item.title}</div>
                </Link>
                <button
                  className={
                    "hidden group-hover:flex text-stone-800 hover:text-red-500"
                  }
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
              </div>
            ))}
      </div>
    </div>
  );
};

export default SecondaryNav;
