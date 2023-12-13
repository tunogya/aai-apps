"use client";
import React from "react";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import dynamic from "next/dynamic";
import SubscribeButton from "@/app/components/SubscribeButton";
import CheckoutButton from "@/app/components/CheckoutButton";

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
      {isLoading ? (
        <div className={"w-72 h-11"}>
          <Skeleton className={"w-full h-full"} />
        </div>
      ) : (
        <div className={"flex space-x-4 items-center"}>
          {data?.subscription?.isPremium ? (
            <ManageBillingButton
              className={
                "bg-gray-800 text-white px-4 py-3 rounded-md text-sm font-semibold hover:opacity-80"
              }
            />
          ) : (
            <>
              <SubscribeButton
                price={"price_1OMY3OFPpv8QfieYllRGM9yi"}
                className={
                  "bg-blue-500 text-white px-4 py-3 rounded-md text-sm font-semibold hover:opacity-80"
                }
              />
              <CheckoutButton
                price={"price_1OMqvWFPpv8QfieY0AdXpAsx"}
                className={
                  "border-2 border-blue-500 text-blue-500 px-4 py-3 rounded-md text-sm font-semibold hover:opacity-80"
                }
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Subscription;
