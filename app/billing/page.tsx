"use client";
import React from "react";

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
        <button
          className={
            "bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold"
          }
          onClick={async () => {
            const data = await fetch("/api/billing").then((res) => res.json());
            if (data?.session?.url) {
              window.location.href = data.session.url;
            }
          }}
        >
          Buy credits
        </button>
      </div>

      <div className={"space-y-4"}>
        <div className={"text-3xl text-gray-800 font-semibold"}>AbandonAI+</div>
        <div className={"text-xl text-gray-800 font-semibold"}>
          You currently hold a valid subscription.
        </div>
        <div className={"text-gray-600 text-sm"}>
          Enjoy all our features for free.
        </div>
        <button
          className={
            "bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold"
          }
          onClick={async () => {
            const data = await fetch("/api/billing").then((res) => res.json());
            if (data?.session?.url) {
              window.location.href = data.session.url;
            }
          }}
        >
          Manage billing
        </button>
      </div>
    </div>
  );
}
