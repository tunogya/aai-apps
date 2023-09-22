"use client";
import React from "react";
import useSWR from "swr";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { roundUp } from "@/utils/roundUp";

const CSR = () => {
  const { data, isLoading } = useSWR("/api/dashboard/today", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"flex flex-col xl:flex-row gap-10 xl:gap-20 h-fit w-full"}>
      <div className={"w-full xl:max-w-2xl h-full text-sm text-stone-800"}>
        <div className={"flex w-full"}>
          <div className={"w-[50%] space-y-1"}>
            <div className={"whitespace-nowrap"}>Cost & usage</div>
            <div className={"text-stone-800 text-xl"}>
              US$
              {roundUp(data?.cost?.today || 0, 6)}
            </div>
          </div>
          <div className={"w-[50%] space-y-1"}>
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
              <Tooltip />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: "10px" }}
                tickFormatter={(value, index) => value.slice(-4)}
              />
              <Bar dataKey="total_cost" fill="#8884d8" minPointSize={1} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div
        className={
          "flex flex-row xl:flex-col w-96 h-full text-sm text-stone-800 gap-20 xl:gap-10"
        }
      >
        <div className={"space-y-1"}>
          <div className={"whitespace-nowrap"}>Estimate cost this month</div>
          <div className={"text-stone-800 text-xl"}>
            US$
            {roundUp(data?.estimate?.month || 0, 6)}
          </div>
        </div>
        <div className={"space-y-1"}>
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
