import React from "react";
import Today from "@/app/dashboard/Today";

export const runtime = "edge";

export default async function SSRPage() {
  return (
    <div
      className={
        "px-4 md:px-10 md:pt-4 absolute h-[calc(100vh-60px)] w-full overflow-y-auto pb-40 space-y-20"
      }
    >
      <Today />
    </div>
  );
}
