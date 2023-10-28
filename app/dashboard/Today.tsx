import React from "react";
import dynamic from "next/dynamic";
import {
  Chart,
  CreditBalance,
  TodayCost,
  USDBalance,
  YesterdayCost,
} from "@/app/dashboard/TodayComponents";

const DepositButton = dynamic(() => import("@/components/DepositButton"), {
  ssr: false,
});

export const runtime = "edge";

const SSR = () => {
  return (
    <div className={"flex flex-col gap-2 xl:gap-8"}>
      <div
        className={
          "flex gap-2 w-full py-1 xl:border-b text-gray-800 justify-between"
        }
      >
        <div className={"text-[28px] font-semibold"}>Today</div>
      </div>
      <div className={"flex h-[230px] w-full gap-5"}>
        <div className={"flex flex-col max-w-[760px] h-[230px] w-full gap-1"}>
          <div className={"flex gap-20 h-[70px]"}>
            <div className={"flex flex-col gap-1"}>
              <div className={"flex justify-between items-center text-sm"}>
                <div className={"text-gray-600"}>Gross costs (UTC+0)</div>
              </div>
              <TodayCost />
            </div>
            <div className={"flex flex-col gap-1"}>
              <div className={"flex justify-between items-center text-sm"}>
                <div className={"text-gray-600"}>Yesterday</div>
              </div>
              <YesterdayCost />
            </div>
          </div>
          <Chart />
        </div>
        <div className={"flex flex-col flex-1 min-w-fit"}>
          <div
            className={
              "h-[105px] pl-5 pb-5 w-full border-b flex flex-col gap-1"
            }
          >
            <div className={"flex justify-between items-center text-sm gap-5"}>
              <div className={"text-gray-600"}>USD Balance</div>
              <DepositButton className={"text-[#0066FF]"} />
            </div>
            <USDBalance />
            <div className={"text-xs text-gray-400"}>Advanced pay balance</div>
          </div>
          <div className={"h-[105px] pl-5 pt-5 w-full flex flex-col gap-1"}>
            <div className={"flex justify-between items-center text-sm"}>
              <div className={"text-gray-600"}>Credit Points</div>
              {/*<div className={"text-[#0066FF]"}>View</div>*/}
            </div>
            <CreditBalance />
            <div className={"text-xs text-gray-400"}>Abandon credit points</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSR;
