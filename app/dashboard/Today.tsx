"use client";
import React from "react";
import useSWR from "swr";

const CSR = () => {
  const { data, isLoading } = useSWR("/api/dashboard/today", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"flex gap-8 h-40"}>
      <div className={"w-full max-w-3xl h-full text-sm text-stone-800"}>
        <div className={"flex"}>
          <div className={"w-64 space-y-1"}>
            <div className={"whitespace-nowrap"}>Cost & usage</div>
            <div className={"text-stone-800 text-xl"}>
              US${data?.cost?.today || "-"}
            </div>
          </div>
          <div className={"w-64 space-y-1"}>
            <div className={"whitespace-nowrap"}>Yesterday</div>
            <div className={"text-stone-400 text-md"}>
              US${data?.cost?.yesterday || "-"}
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div className={"flex-1 h-full text-sm text-stone-800"}>
        <div className={"h-[50%]"}>
          <div className={"space-y-1"}>
            <div className={"whitespace-nowrap"}>Estimate cost this month</div>
            <div className={"text-stone-800 text-xl"}>
              US${data?.estimate?.month || "-"}
            </div>
          </div>
        </div>
        <div className={"h-[50%]"}>
          <div className={"space-y-1"}>
            <div className={"whitespace-nowrap"}>Advance pay balance</div>
            <div className={"text-stone-800 text-xl"}>
              US${data?.advance_pay?.balance || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSR;
