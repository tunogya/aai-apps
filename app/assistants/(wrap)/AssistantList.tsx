"use client";

import { ArrowPathIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";

const Types = [
  "all",
  "gpt-4-1106-preview",
  "gpt-4",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo",
];

const AssistantList = () => {
  const [selectIndex, setSelectIndex] = useState(0);
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

  // if (reducedData.length === 0) {
  //   return (
  //     <div className={"flex flex-col items-center justify-center flex-1 gap-2"}>
  //       <RocketLaunchIcon className={"w-5 h-5"} />
  //       <div className={"text-gray-800 font-medium"}>Create an assistant</div>
  //       <Link href={"/assistants/create"}>
  //         <div
  //           className={
  //             "bg-[#0066FF] text-white px-2 py-1 rounded-lg font-medium text-sm"
  //           }
  //         >
  //           + Create
  //         </div>
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <div className={"w-full h-full"}>
      <div className={"flex space-x-2 justify-between"}>
        {Types.map((item, index) => (
          <button
            key={index}
            className={`p-[11px] border rounded-lg w-full text-sm ring-[#0066FF] hover:ring-1 font-medium ${
              selectIndex === index
                ? "text-[#0066FF] border-[#0066FF] ring-1"
                : "text-gray-800"
            }`}
            onClick={() => {
              setSelectIndex(index);
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssistantList;
