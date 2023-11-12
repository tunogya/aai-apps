import React from "react";

export const runtime = "edge";

export default async function SSRPage() {
  return (
    <div
      className={
        "px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full overflow-y-auto space-y-20"
      }
    >
      <div className={"space-y-2 xl:gap-8"}>
        <div
          className={
            "flex gap-2 w-full py-1 xl:border-b text-gray-800 justify-between"
          }
        >
          <div className={"text-3xl font-semibold"}>Personas</div>
        </div>
      </div>
    </div>
  );
}
