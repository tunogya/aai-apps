"use client";

import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import MessageBox from "@/app/threads/[[...id]]/MessageBox";
import Skeleton from "react-loading-skeleton";

const CSR = () => {
  const { id } = useParams();
  const { data } = useSWR(`/api/assistants/threads/${id}`, (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div
      className={
        "flex flex-col px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full overflow-y-auto"
      }
    >
      <div className={"space-y-2 pt-5 pb-3 border-b"}>
        <div
          className={
            "flex gap-2 w-full py-1 text-gray-800 justify-between items-center"
          }
        >
          <div className={"text-sm font-semibold text-[#0066FF]"}>Logs</div>
        </div>
        <div className={"text-3xl font-semibold text-gray-800"}>{id}</div>
      </div>
      <div className={"py-4"}>
        <div className={"text-gray-800 font-semibold mb-2"}>Messages:</div>
        {data ? (
          data?.messages.data.map((message: any, index: number) => (
            <MessageBox message={message} key={index} />
          ))
        ) : (
          <Skeleton count={5} className={"h-[120px]"} />
        )}
      </div>
    </div>
  );
};

export default CSR;
