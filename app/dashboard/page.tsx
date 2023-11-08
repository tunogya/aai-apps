import React from "react";
import dynamic from "next/dynamic";

const Today = dynamic(() => import("@/app/dashboard/Today"), { ssr: false });

export const runtime = "edge";

export default async function SSRPage() {
  return (
    <div
      className={
        "px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full overflow-y-auto space-y-20"
      }
    >
      {/*<Today />*/}
    </div>
  );
}
