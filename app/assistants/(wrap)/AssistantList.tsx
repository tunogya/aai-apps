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

  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, (url) =>
    fetch(url).then((res) => res.json()),
  );

  if (isLoading) {
    return <ArrowPathIcon className={"w-4 h-4 animate-spin"} />;
  }

  if (data?.[data?.length - 1]?.length === 0) {
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

  return (
    <div className={"w-full h-full"}>
      <div className={"flex space-x-2 justify-between"}>
        {Types.map((item, index) => (
          <button
            key={index}
            className={`p-[11px] border rounded-lg w-full text-sm ring-[#0066FF] hover:ring-1 whitespace-nowrap ${
              selectIndex === index
                ? "text-[#0066FF] border-[#0066FF] ring-1 font-semibold"
                : "text-gray-800 font-normal"
            }`}
            onClick={() => {
              setSelectIndex(index);
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <div className={"mt-4"}>
        <table className={"table-auto w-full"}>
          <thead className={"border-y"}>
            <tr className={"text-xs text-gray-700"}>
              <th className={"py-2 pr-6 text-start"}>Name</th>
              <th className={"py-2 pr-6 text-start"}>Instructions</th>
              <th className={"py-2 pr-6 text-start"}>Voice</th>
              <th className={"py-2 pr-6 text-start"}>Model</th>
              <th className={"py-2 pr-6 text-start"}>Created</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Tom",
                instructions: "Hello, how are you?",
                voice: "Tom",
                model: "gpt-3.5-turbo",
                created: new Date().getTime(),
              },
              {
                name: "Tom",
                instructions: "Hello, how are you?",
                voice: "Tom",
                model: "gpt-3.5-turbo",
                created: new Date().getTime(),
              },
              {
                name: "Tom",
                instructions: "Hello, how are you?",
                voice: "Tom",
                model: "gpt-3.5-turbo",
                created: new Date().getTime(),
              },
            ].map((item: any, index: number) => (
              <tr
                key={index}
                className={
                  "border-b text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
                }
              >
                <td className={"py-2 pr-6 text-gray-700 font-semibold"}>
                  {item.name}
                </td>
                <td className={"py-2 pr-6"}>{item.instructions}</td>
                <td className={"py-2 pr-6"}>{item.voice}</td>
                <td className={"py-2 pr-6"}>{item.model}</td>
                <td className={"py-2 pr-6"}>xxx</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={"flex mt-4 justify-between"}>
          <div className={"text-sm text-gray-700"}>12 of 100</div>
          <div className={"flex space-x-2"}>
            <button
              disabled
              className={
                "text-xs text-gray-700 disabled:text-gray-500 bg-white border px-2 py-1 rounded-lg disabled:cursor-auto"
              }
            >
              Previous
            </button>
            <button
              className={
                "text-xs text-gray-700 disabled:text-gray-500 bg-white border px-2 py-1 rounded-lg disabled:cursor-auto"
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantList;
