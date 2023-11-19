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
        "px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full overflow-y-auto space-y-20"
      }
    >
      <div className={"space-y-4"}>
        <div className={"text-3xl text-gray-800 font-semibold"}>
          Pay as You Go
        </div>
        <div className={"text-xl text-gray-800 font-semibold"}>
          Available credits
        </div>
        <Balance />
        <div className={"text-gray-600 text-sm max-w-screen-md"}>
          Instead of paying a monthly recurring charge, you can buy credits as
          needed through our Pay As You Go plan.
          <br />
          It&#39;s best for infrequent users. 1 credit can enjoy all functions
          for 1 day.
        </div>
        <div className={"flex gap-4"}>
          <TopUpButton />
        </div>
      </div>
      <div className={"space-y-4"}>
        <div className={"text-3xl text-gray-800 font-semibold"}>
          Abandon AI+
        </div>
        <div className={"text-xl text-gray-800 font-semibold"}>
          20 credits per month.
        </div>
        <div className={"text-gray-600 text-sm"}>
          Enjoy all our features for 1 month.
        </div>
        <div className={"flex gap-4"}>
          <SubscribeButton />
          <ManageBillingButton />
        </div>
      </div>
    </div>
  );
}
