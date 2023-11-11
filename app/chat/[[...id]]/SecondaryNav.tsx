"use client";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";
import dynamic from "next/dynamic";

const SecondaryNavItem = dynamic(
  () => import("@/app/chat/[[...id]]/SecondaryNavItem"),
  {
    ssr: false,
  },
);

const SecondaryNav = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.nextCursor) return null;
    if (pageIndex === 0) return `/api/conversation?limit=20`;
    return `/api/conversation?cursor=${previousPageData.nextCursor}&limit=20`;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    (url) => fetch(url).then((res) => res.json()),
    {
      refreshInterval: 5_000,
    },
  );

  const reducedData = useMemo(() => {
    if (!data) return [];
    return data.reduce((a, b) => a.concat(b?.items || []), []);
  }, [data]);

  const haveMore = useMemo(() => {
    return reducedData.length % 20 === 0 && reducedData.length > 0;
  }, [reducedData]);

  const currentChatId = params?.id?.[0] || null;
  const [deleteItems, setDeleteItems] = useState<string[]>([]);

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

  useEffect(() => {
    const items = JSON.parse(sessionStorage.getItem("deleteItems") || "[]");
    if (items) {
      setDeleteItems(items);
    }
  }, []);

  return (
    <div
      className={
        "w-[300px] shrink-0 h-full border-r overflow-y-auto flex-col hidden md:flex"
      }
    >
      <Link
        href={`/chat?model=${searchParams.get("model") || "gpt-3.5-turbo"}`}
        prefetch
        className={
          "flex items-center border hover:bg-gray-50 p-3 rounded cursor-pointer select-none m-2 text-gray-800"
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
        <div className={"text-sm text-gray-800"}>New Chat</div>
      </Link>
      <div className={"h-full overflow-y-auto px-2"}>
        {reducedData?.length > 0 && (
          <div className={"mb-2"}>
            {reducedData
              ?.sort((a: any, b: any) => b.updated - a.updated)
              ?.map((item: any) => (
                <SecondaryNavItem
                  key={item.SK}
                  item={item}
                  currentChatId={currentChatId}
                  deleteItems={deleteItems}
                  setDeleteItems={setDeleteItems}
                  deleteChat={deleteChat}
                />
              ))}
          </div>
        )}
        {haveMore ? (
          <button
            className={`w-full border p-2 text-xs hover:bg-gray-50 rounded ${
              isValidating ? "cursor-wait" : ""
            }`}
            onClick={() => setSize(size + 1)}
          >
            {isValidating ? "Loading..." : "Load More"}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SecondaryNav;
