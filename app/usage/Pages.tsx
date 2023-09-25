"use client";
import { roundUp } from "@/utils/roundUp";
import moment from "moment";
import React from "react";
import useSWRInfinite from "swr/infinite";

const Pages = () => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.nextCursor) return null;
    if (pageIndex === 0) return `/api/usage?limit=20`;
    return `/api/usage?cursor=${previousPageData.nextCursor}&limit=20`;
  };

  const { data, isLoading, size, setSize } = useSWRInfinite(getKey, (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"w-full overflow-hidden"}>
      <table className="table-fixed w-full">
        <thead>
          <tr className={"text-xs text-gray-500 border-b"}>
            <th
              className={
                "text-start pt-2 pr-4 pb-2 overflow-x-hidden font-semibold"
              }
            >
              Model
            </th>
            <th
              className={
                "text-start pt-2 pr-4 pb-2 overflow-x-hidden font-semibold"
              }
            >
              Prompt tokens
            </th>
            <th
              className={
                "text-start pt-2 pr-4 pb-2 overflow-x-hidden font-semibold"
              }
            >
              Completion tokens
            </th>
            <th
              className={
                "text-start pt-2 pr-4 pb-2 overflow-x-hidden font-semibold"
              }
            >
              Total cost
            </th>
            <th
              className={
                "text-start pt-2 pr-4 pb-2 overflow-x-hidden font-semibold"
              }
            >
              Created
            </th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data
              .reduce((a, b) => a.concat(b?.items || []), [])
              .map((item: any, index: number) => (
                <tr key={index} className={"text-xs text-gray-600 border-b"}>
                  <td
                    className={
                      "font-semibold pt-2 pr-4 pb-2 overflow-x-hidden text-black"
                    }
                  >
                    {item.model}
                  </td>
                  <td className={"pt-2 pr-4 pb-2 overflow-x-hidden "}>
                    {item.prompt_tokens}
                  </td>
                  <td className={"pt-2 pr-4 pb-2 overflow-x-hidden"}>
                    {item.completion_tokens}
                  </td>
                  <td className={"pt-2 pr-4 pb-2 overflow-x-hidden"}>
                    {roundUp(item.total_cost, 6)}
                  </td>
                  <td className={"pt-2 pr-4 pb-2 overflow-x-hidden"}>
                    {moment(item.created * 1000)
                      .startOf("hour")
                      .fromNow()}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      <button
        className={"w-full border p-2 mt-4 text-xs hover:bg-gray-50 rounded"}
        onClick={() => setSize(size + 1)}
      >
        {isLoading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
};

export default Pages;
