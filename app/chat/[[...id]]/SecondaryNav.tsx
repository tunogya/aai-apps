"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import dynamic from "next/dynamic";
import { PlusIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";

const SecondaryNavItem = dynamic(
  () => import("@/app/chat/[[...id]]/SecondaryNavItem"),
);

const SecondaryNav = () => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.nextCursor) return null;
    if (pageIndex === 0) return `/api/conversation?limit=20`;
    return `/api/conversation?cursor=${previousPageData.nextCursor}&limit=20`;
  };

  const { data, size, setSize, isLoading } = useSWRInfinite(
    getKey,
    (url) => fetch(url).then((res) => res.json()),
    {
      refreshInterval: 3_000,
    },
  );

  const reducedData = useMemo(() => {
    if (!data) return [];
    return data.reduce((a, b) => a.concat(b?.items || []), []);
  }, [data]);

  const haveMore = useMemo(() => {
    return reducedData.length % 20 === 0 && reducedData.length > 0;
  }, [reducedData]);

  return (
    <div
      className={
        "w-[240px] xl:w-[300px] shrink-0 h-full border-r hidden lg:block"
      }
    >
      <Link
        href={`/chat`}
        prefetch
        className={
          "flex items-center border hover:bg-gray-50 p-3 rounded cursor-pointer select-none m-2 text-gray-800"
        }
      >
        <div className={"p-1"}>
          <PlusIcon className={"w-4 h-4 stroke-2"} />
        </div>
        <div className={"text-sm text-gray-800"}>New Chat</div>
      </Link>
      <div className={"h-[calc(100vh-66px)] overflow-y-auto px-2"}>
        {isLoading && <Skeleton count={5} height={"36px"} />}
        {reducedData?.length > 0 && (
          <div className={"mb-2"}>
            {reducedData
              ?.sort((a: any, b: any) => b.updated - a.updated)
              ?.map((item: any) => (
                <SecondaryNavItem key={item.SK} item={item} />
              ))}
          </div>
        )}
        {haveMore ? (
          <button
            className={`w-full border p-2 mb-2 text-xs hover:bg-gray-50 rounded ${
              isLoading ? "cursor-wait" : ""
            }`}
            onClick={() => setSize(size + 1)}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SecondaryNav;
