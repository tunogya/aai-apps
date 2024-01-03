"use client";

import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import moment from "moment/moment";

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
        {data?.messages.data
          .map((message: any, index: number) => (
            <div
              key={index}
              className={`border-b p-5 flex flex-col ${
                message?.role === "user" ? "bg-gray-50" : ""
              }`}
            >
              <div
                className={"text-sm text-gray-500 flex justify-between mb-1"}
              >
                <div>{message?.role}</div>
                <div className={"text-gray-400 text-[13px]"}>
                  {moment(message?.created_at * 1000)
                    .startOf("second")
                    .fromNow()}
                </div>
              </div>
              <div className={"text-gray-800 break-all"}>
                {message?.content?.[0]?.text?.value}
              </div>
            </div>
          ))
          .reverse()}
      </div>
    </div>
  );
};

export default CSR;
