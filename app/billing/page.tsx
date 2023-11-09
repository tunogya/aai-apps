"use client";
import React from "react";
import TopUpButton from "@/components/TopUpButton";
import SubscribeButton from "@/components/SubscribeButton";
import Image from "next/image";

export default function CSRPage() {
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
        <div className={"text-4xl text-gray-800"}>$0.00</div>
        <div className={"text-gray-600 text-sm max-w-screen-md"}>
          Credits can be used to offset expenses within the Abandon platform,
          including the Abandon+ subscription.
        </div>
        <div className={"flex gap-4"}>
          <TopUpButton />
          <button
            className={
              "flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer"
            }
          >
            <Image
              alt={""}
              src={"/worldcoin-logos.svg"}
              width={20}
              height={20}
              fetchPriority={"low"}
            />
            Worldcoin
          </button>
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
        <SubscribeButton
          className={
            "bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold"
          }
        />
      </div>
    </div>
  );
}
