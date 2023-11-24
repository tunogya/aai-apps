"use client";

import { ArrowPathIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useMemo } from "react";
import useSWRInfinite from "swr/infinite";

const AssistantList = () => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.nextCursor) return null;
    if (pageIndex === 0) return `/api/assistants?limit=20`;
    return `/api/assistants?cursor=${previousPageData.nextCursor}&limit=20`;
  };

  const { data, size, setSize, isLoading } = useSWRInfinite(
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

  if (isLoading) {
    return <ArrowPathIcon className={"w-4 h-4 animate-spin"} />;
  }

  if (reducedData.length === 0) {
    return (
      <div className={"flex flex-col items-center justify-center flex-1 gap-2"}>
        <RocketLaunchIcon className={"w-5 h-5"} />
        <div className={"text-gray-800 font-medium"}>Create an assistant</div>
        <Link href={"/assistants/create"}>
          <div
            className={
              "bg-[#0066FF] text-white px-2 py-1 rounded-lg font-medium text-sm"
            }
          >
            + Create
          </div>
        </Link>
      </div>
    );
  }

  return <div>AssistantList</div>;
};

export default AssistantList;
