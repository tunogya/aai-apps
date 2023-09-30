import React from "react";
import Today from "@/app/dashboard/Today";

export const runtime = "edge";

export default async function SSRPage() {
  return (
    <div
      className={
        "px-4 md:px-10 pt-4 absolute h-[calc(100vh-60px)] w-full overflow-y-auto pb-40 space-y-20"
      }
    >
      <div className={"space-y-3 md:space-y-8"}>
        <div
          className={
            "text-2xl font-semibold text-black md:border-b w-full py-2"
          }
        >
          Today
        </div>
        <Today />
      </div>
    </div>
  );
}
