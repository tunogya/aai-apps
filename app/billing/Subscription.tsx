"use client";
import React from "react";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import dynamic from "next/dynamic";
import SubscribeButton from "@/app/components/SubscribeButton";

const ManageBillingButton = dynamic(
  () => import("@/app/components/ManageBillingButton"),
  {
    loading: () => (
      <div className={"h-9 w-32"}>
        <Skeleton className={"w-full h-8"} />
      </div>
    ),
  },
);

const Subscription = () => {
  const { data, isLoading } = useSWR("/api/customer", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"space-y-2"}>
      <div
        className={
          "text-xl text-gray-800 font-semibold flex items-center gap-2"
        }
      >
        <div>Current plan:</div>
        <div
          className={`w-60 ${
            data?.subscription?.isPremium ? "text-[#AB68FF]" : ""
          }`}
        >
          {isLoading ? (
            <Skeleton className={"h-7"} />
          ) : (
            data?.subscription?.name || "N/A"
          )}
        </div>
      </div>
      <div className={"text-gray-600 text-sm max-w-screen-md py-2"}>
        {data?.subscription?.isPremium
          ? "Enjoy ad-free ChatGPT, Assistants, and more. Cancel anytime."
          : "You can upgrade to Premium to enjoy ad-free, GPT4, DALL·E 3, and more. Cancel anytime."}
      </div>
      <div className={"flex space-x-4 items-center"}>
        <ManageBillingButton
          className={
            "bg-gray-100 text-gray-800 px-4 py-3 rounded-md text-sm font-semibold hover:shadow"
          }
        />
        <SubscribeButton
          price={"price_1OMY3OFPpv8QfieYllRGM9yi"}
          className={
            "px-4 py-2 border-2 border-[#0066FF] rounded-full font-medium text-sm text-[#0066FF]"
          }
        />
      </div>
    </div>
  );
};

export default Subscription;
