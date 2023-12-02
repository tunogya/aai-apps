"use client";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import MorePopover from "@/app/assistants/([id])/[id]/MorePopover";

const Detail = dynamic(() => import("@/app/assistants/([id])/[id]/Detail"));
const Overview = dynamic(() => import("@/app/assistants/([id])/[id]/Overview"));
const Events = dynamic(() => import("@/app/assistants/([id])/[id]/Events"));

const CSRPage = () => {
  const [type, setType] = useState("overview");

  return (
    <div
      className={
        "flex px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full overflow-y-auto space-x-8"
      }
    >
      <div className={"space-y-2 py-1 text-gray-800 w-80"}>
        <Link
          href={"/assistants"}
          prefetch
          className={"text-sm font-semibold text-[#0066FF]"}
        >
          Assistants
        </Link>
        <Detail />
      </div>
      <div className={"space-y-6 flex-1 py-1 text-gray-800"}>
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
              Events
            </button>
          </div>
          <MorePopover />
        </div>
        {type === "overview" ? <Overview /> : <Events />}
      </div>
    </div>
  );
};

export default CSRPage;
