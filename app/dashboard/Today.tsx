"use client";
import React from "react";
import useSWR from "swr";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { roundUp } from "@/utils/roundUp";
import { useSearchParams } from "next/navigation";

const CSR = () => {
  const { data, isLoading } = useSWR("/api/dashboard/today", (url) =>
    fetch(url).then((res) => res.json()),
  );
  const searchParams = useSearchParams();
  const model = searchParams.get("model") || "gpt-3.5-turbo";
  const isPurple = model.startsWith("gpt-4");

  return (
    <div className={"flex flex-col xl:flex-row gap-10 xl:gap-20 h-fit w-full"}>
      <div className={"w-full xl:max-w-2xl h-full text-sm text-stone-800"}>
        <div className={"flex w-full gap-10"}>
          <div className={"w-[200px] space-y-1"}>
            <div className={"whitespace-nowrap"}>Cost & usage</div>
            <div className={"text-stone-800 text-xl"}>
              US$
              {roundUp(data?.cost?.today || 0, 6)}
            </div>
          </div>
          <div className={"w-[200px] space-y-1"}>
            <div className={"whitespace-nowrap"}>Yesterday</div>
            <div className={"text-stone-400 text-md"}>
              US$
              {roundUp(data?.cost?.yesterday || 0, 6)}
            </div>
          </div>
        </div>
        <div className={"h-[180px] w-full mt-4"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.charts || []}>
              <Tooltip
                formatter={(value, name) => [value, "Cost"]}
                itemStyle={{
                  fontSize: "12px",
                }}
                wrapperStyle={{
                  fontSize: "12px",
                }}
                contentStyle={{
                  borderRadius: "4px",
                  padding: "4px 8px",
                }}
                cursor={{
                  fill: "#f5f5f4",
                }}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: "10px" }}
                tickFormatter={(value, index) => value.slice(-4)}
              />
              <Bar
                dataKey="total_cost"
                fill={isPurple ? "#AB68FF" : "#19C37D"}
                minPointSize={1}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div
        className={
          "flex flex-row xl:flex-col w-96 h-full text-sm text-stone-800 gap-20 xl:gap-10"
        }
      >
        <div className={"w-[200px] space-y-1"}>
          <div className={"whitespace-nowrap"}>Estimate cost this month</div>
          <div className={"text-stone-800 text-xl"}>
            US$
            {roundUp(data?.estimate?.month || 0, 6)}
          </div>
        </div>
        <div className={"w-[200px] space-y-1"}>
          <div className={"whitespace-nowrap"}>Advance pay balance</div>
          <div
            className={`${
              data?.advance_pay?.balance < 0 ? "text-red-500" : "text-stone-800"
            }  text-xl`}
          >
            US$
            {roundUp(data?.advance_pay?.balance || 0, 6)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSR;
