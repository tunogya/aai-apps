"use client";
import React from "react";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import dynamic from "next/dynamic";

const TopUpButton = dynamic(() => import("@/app/components/TopUpButton"), {
  loading: () => (
    <div className={"h-9 w-32"}>
      <Skeleton className={"w-full h-8"} />
    </div>
  ),
});
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
      <div className={"text-md text-gray-800 font-semibold"}>
        Credit remaining
      </div>
      <div className={`text-4xl flex items-center gap-1`}>
        <div>$</div>
        <div className={"w-32"}>
          {isLoading ? <Skeleton /> : (data?.customer?.balance / 100) * -1}
        </div>
      </div>
      <div className={"text-gray-600 text-sm max-w-screen-md py-2"}>
        {data?.subscription?.isPremium
          ? "Enjoy ad-free ChatGPT, Assistants, and more. Cancel anytime."
          : "You can upgrade to Premium to enjoy ad-free ChatGPT, Assistants, and more. Cancel anytime."}
      </div>
      <div className={"flex space-x-4 items-center"}>
        <TopUpButton
          className={
            "flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer hover:shadow"
          }
        />
        <ManageBillingButton
          className={
            "bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold hover:shadow"
          }
        />
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
  );
};

export default Subscription;
