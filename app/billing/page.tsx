import React from "react";
import dynamic from "next/dynamic";

const TopUpButton = dynamic(() => import("@/components/TopUpButton"), {
  ssr: false,
});
const ManageBillingButton = dynamic(
  () => import("@/components/ManageBillingButton"),
  { ssr: false },
);
const SubscribeButton = dynamic(() => import("@/components/SubscribeButton"), {
  ssr: false,
});
const Balance = dynamic(() => import("@/app/billing/Balance"), { ssr: false });

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
          Abandon credits
        </div>
        <div className={"text-xl text-gray-800 font-semibold"}>
          Available balance
        </div>
        <Balance />
        <div className={"text-gray-600 text-sm max-w-screen-md"}>
          Use credits to save on Abandon services, including your Abandon+
          subscription.
        </div>
        <div className={"flex gap-4"}>
          <TopUpButton />
        </div>
      </div>
      <div className={"space-y-4"}>
        <div className={"text-3xl text-gray-800 font-semibold"}>AbandonAI+</div>
        <div className={"text-xl text-gray-800 font-semibold"}>
          You currently hold a valid subscription.
        </div>
        <div className={"text-gray-600 text-sm"}>
          Enjoy all our features for free.
        </div>
        <div className={"flex gap-4"}>
          <SubscribeButton />
          <ManageBillingButton />
        </div>
      </div>
    </div>
  );
}
