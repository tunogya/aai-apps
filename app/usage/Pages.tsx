"use client";
import { roundUp } from "@/utils/roundUp";
import moment from "moment";
import React, { useMemo } from "react";
import useSWRInfinite from "swr/infinite";

const Pages = () => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.nextCursor) return null;
    if (pageIndex === 0) return `/api/usage?limit=20`;
    return `/api/usage?cursor=${previousPageData.nextCursor}&limit=20`;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, (url) =>
    fetch(url).then((res) => res.json()),
  );

  const reducedData = useMemo(() => {
    if (!data) return [];
    return data.reduce((a, b) => a.concat(b?.items || []), []);
  }, [data]);

  const haveMore = useMemo(() => {
    return reducedData.length % 20 === 0;
  }, [reducedData]);

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
              Prompt
            </th>
            <th
              className={
                "text-start pt-2 pr-4 pb-2 overflow-x-hidden font-semibold"
              }
            >
              Completion
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
          {reducedData.map((item: any, index: number) => (
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
                  .startOf("second")
                  .fromNow()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {haveMore ? (
        <button
          className={`w-full border p-2 mt-4 text-xs hover:bg-gray-50 rounded ${
            isValidating ? "cursor-wait" : ""
          }`}
          onClick={() => setSize(size + 1)}
        >
          {isValidating ? "Loading..." : "Load More"}
        </button>
      ) : (
        <div
          className={
            "w-full border p-2 mt-4 text-xs bg-gray-50 rounded text-center cursor-not-allowed"
          }
        >
          No more data.
        </div>
      )}
    </div>
  );
};

export default Pages;
