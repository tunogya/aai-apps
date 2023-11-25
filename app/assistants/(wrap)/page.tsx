import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const AssistantList = dynamic(
  () => import("@/app/assistants/(wrap)/AssistantList"),
);

export const runtime = "edge";

export default async function SSRPage() {
  return (
    <div
      className={
        "flex flex-col px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full overflow-y-auto space-y-4"
      }
    >
      <div
        className={
          "flex gap-2 w-full py-1 text-gray-800 justify-between items-center"
        }
      >
        <div className={"text-3xl font-semibold"}>Assistants</div>
        <Link href={"/assistants/create"} prefetch>
          <div
            className={
              "bg-[#0066FF] text-white px-2 py-1 rounded-lg font-medium text-sm"
            }
          >
            + Create
          </div>
        </Link>
      </div>
      <AssistantList />
    </div>
  );
}
