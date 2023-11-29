import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

const Subscription = dynamic(() => import("@/app/billing/Subscription"), {
  loading: () => <Skeleton className={""} count={3} />,
});

export const runtime = "edge";

export default async function SSRPage() {
  return (
    <div
      className={
        "px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full overflow-y-auto space-y-8"
      }
    >
      <div
        className={
          "flex gap-2 w-full pt-1 pb-2 xl:border-b text-gray-800 justify-between"
        }
      >
        <div className={"text-3xl font-semibold"}>Billing Settings</div>
      </div>
      <Subscription />
    </div>
  );
}
