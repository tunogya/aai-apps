"use client";
import React from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { roundUp } from "@/utils/roundUp";

const DepositButton = dynamic(() => import("@/components/DepositButton"), {
  ssr: false,
});

const CSR = () => {
  const { data: costData } = useSWR("/api/dashboard/cost", (url) =>
    fetch(url).then((res) => res.json()),
  );
  const { data: balanceData } = useSWR("/api/dashboard/balance", (url) =>
    fetch(url).then((res) => res.json()),
  );
  const { data: todayData } = useSWR("/api/dashboard/today", (url) =>
    fetch(url).then((res) => res.json()),
  );
  const timestamp = new Date().getUTCHours();

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
              <div className={"text-gray-800 select-text"}>
                ${costData?.today || "0"}
              </div>
            </div>
            <div className={"flex flex-col gap-1"}>
              <div className={"flex justify-between items-center text-sm"}>
                <div className={"text-gray-600"}>Yesterday</div>
              </div>
              <div className={"text-gray-400 select-text"}>
                ${costData?.yesterday || "0"}
              </div>
            </div>
          </div>
          <div className={"h-[128px] w-full mt-4"}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={todayData || []}>
                <CartesianGrid strokeOpacity={0.5} horizontal={false} />
                <XAxis
                  dataKey="hour"
                  axisLine={{
                    stroke: "#c9c9c9",
                  }}
                  type={"number"}
                  tickLine={{
                    stroke: "#c9c9c9",
                  }}
                  tick={{ fontSize: "10px" }}
                  height={16}
                />
                <Bar
                  stackId="a"
                  strokeWidth={2}
                  dataKey={"gpt4"}
                  fill={"#AB68FF"}
                />
                <ReferenceLine
                  x={timestamp}
                  stroke="#0066FF"
                  strokeDasharray={"4 4"}
                  opacity={0.5}
                />
                <Bar
                  stackId="a"
                  strokeWidth={2}
                  dataKey={"gpt3_5"}
                  fill={"#19C37D"}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
            <div className={"text-xl text-gray-800 select-text"}>
              {balanceData?.balance < 0 ? "-" : ""}$
              {roundUp(Math.abs(balanceData?.balance) || 0, 6)}
            </div>
            <div className={"text-xs text-gray-400"}>Advanced pay balance</div>
          </div>
          <div className={"h-[105px] pl-5 pt-5 w-full flex flex-col gap-1"}>
            <div className={"flex justify-between items-center text-sm"}>
              <div className={"text-gray-600"}>Credit Points</div>
              {/*<div className={"text-[#0066FF]"}>View</div>*/}
            </div>
            <div className={"text-xl text-gray-800 select-text"}>
              {roundUp(Math.abs(balanceData?.credit) || 0, 6)} ABD
            </div>
            <div className={"text-xs text-gray-400"}>Abandon credit points</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSR;
