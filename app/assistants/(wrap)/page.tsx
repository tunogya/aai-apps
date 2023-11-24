import React from "react";
import Link from "next/link";

export const runtime = "edge";

export default async function SSRPage() {
  return (
    <div
      className={
        "flex flex-col px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full overflow-y-auto space-y-8"
      }
    >
      <div
        className={
          "flex gap-2 w-full py-1 xl:border-b text-gray-800 justify-between items-center"
        }
      >
        <div className={"text-3xl font-semibold"}>Assistants</div>
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
      <div className={"flex flex-col items-center justify-center flex-1 gap-2"}>
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
    </div>
  );
}
