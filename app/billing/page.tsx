import React from "react";
import dynamic from "next/dynamic";

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
          Pay as You Go / Premium Standard
        </div>
        <div className={"text-md text-gray-800 font-semibold"}>
          Credit remaining
        </div>
        <Balance />
        <div className={"text-gray-600 text-sm max-w-screen-md py-2"}>
          Instead of paying a monthly recurring charge, you can buy credits as
          needed. It&#39;s best for infrequent users.
          <br />
          For those seeking greater savings, consider opting for the AbandonAI
          Premium subscription.
        </div>
        <div className={"flex gap-4"}>
          <TopUpButton />
          <SubscribeButton />
          <ManageBillingButton />
        </div>
      </div>
    </div>
  );
}
