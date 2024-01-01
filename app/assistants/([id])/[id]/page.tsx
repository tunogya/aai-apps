"use client";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Detail = dynamic(() => import("@/app/assistants/([id])/[id]/Detail"));
const Overview = dynamic(() => import("@/app/assistants/([id])/[id]/Overview"));
const Events = dynamic(() => import("@/app/assistants/([id])/[id]/Events"));
const Logs = dynamic(() => import("@/app/assistants/([id])/[id]/Logs"));
const MorePopover = dynamic(
  () => import("@/app/assistants/([id])/[id]/Overview/MorePopover"),
);

const CSRPage = () => {
  const params = useParams();
  const [type, setType] = useState("overview");

  return (
    <div
      className={
        "flex px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full space-x-8 overflow-y-auto"
      }
    >
      <div className={"space-y-2 py-1 px-1 text-gray-800 w-80 pb-10"}>
        <Link
          href={"/assistants"}
          prefetch
          className={"text-sm font-semibold text-[#0066FF]"}
        >
          Assistants
        </Link>
        <Detail />
      </div>
      <div className={"space-y-6 flex-1 py-1 text-gray-800 pb-10"}>
        <div className={"border-b flex justify-between"}>
          <div className={"flex gap-8"}>
            <button
              onClick={() => {
                setType("overview");
              }}
              className={`font-medium border-b-2 ${
                type === "overview"
                  ? "text-[#0066FF] border-[#0066FF]"
                  : "border-transparent text-gray-500"
              } pb-3`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setType("events");
              }}
              className={`font-medium border-b-2 ${
                type === "events"
                  ? "text-[#0066FF] border-[#0066FF]"
                  : "border-transparent text-gray-500"
              } pb-3`}
            >
              Events & Logs
            </button>
          </div>
          <MorePopover />
        </div>
        {type === "overview" ? (
          <Overview assistantId={params?.id as string} />
        ) : (
          <div className={"pb-20 space-y-12"}>
            <Logs />
            <Events />
          </div>
        )}
      </div>
    </div>
  );
};

export default CSRPage;
