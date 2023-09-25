"use client";
import useSWR from "swr";
import { roundUp } from "@/utils/roundUp";
import moment from "moment";
import React, { FC, useMemo, useState } from "react";

const Pages = () => {
  const [cnt, setCnt] = useState(1);

  const pages = useMemo(() => {
    let pages = [];
    for (let i = 0; i < cnt; i++) {
      pages.push(<Page page={i} key={i} />);
    }
    return pages;
  }, [cnt]);

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
        <tbody>{pages}</tbody>
      </table>
      <button
        className={"w-full border p-2 mt-4 text-xs hover:bg-gray-50 rounded"}
        onClick={() => setCnt(cnt + 1)}
      >
        Load More
      </button>
    </div>
  );
};

const Page: FC<{
  page: number;
}> = ({ page }) => {
  const { data } = useSWR(`/api/usage?page=${page}`, (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <>
      {data?.items &&
        data.items.map((item: any, index: number) => (
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
    </>
  );
};

export default Pages;
