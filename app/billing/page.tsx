import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const TopUpButton = dynamic(() => import("@/app/components/TopUpButton"));
const ManageBillingButton = dynamic(
  () => import("@/app/components/ManageBillingButton"),
);
const SubscribeButton = dynamic(
  () => import("@/app/components/SubscribeButton"),
);
const Balance = dynamic(() => import("@/app/billing/Balance"));

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
      <div className={"space-y-2"}>
        <div className={"text-xl text-gray-800 font-semibold"}>
          Current Plan: Premium Standard
        </div>
        <div className={"text-md text-gray-800 font-semibold"}>
          Credit remaining
        </div>
        <Balance />
        <div className={"text-gray-600 text-sm max-w-screen-md py-2"}>
          Enjoy ad-free ChatGPT, Assistants, and more. Cancel anytime.
        </div>
        <div className={"flex gap-4"}>
          <TopUpButton
            className={
              "flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer hover:shadow"
            }
          />
          <ManageBillingButton />
          <Link
            href={"/premium"}
            prefetch
            className={
              "px-4 py-2 border-2 border-[#0066FF] rounded-full font-medium text-sm text-[#0066FF]"
            }
          >
            View all Premium plans
          </Link>
        </div>
      </div>
    </div>
  );
}
