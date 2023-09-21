"use client";
import React from "react";
import useSWR from "swr";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { roundUp } from "@/utils/roundUp";

const CSR = () => {
  const { data, isLoading } = useSWR("/api/dashboard/today", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"flex gap-8 h-40"}>
      <div className={"w-full max-w-2xl h-full text-sm text-stone-800"}>
        <div className={"flex"}>
          <div className={"w-64 space-y-1"}>
            <div className={"whitespace-nowrap"}>Cost & usage</div>
            <div className={"text-stone-800 text-xl"}>
              US$
              {roundUp(data?.cost?.today || 0, 6)}
            </div>
          </div>
          <div className={"w-64 space-y-1"}>
            <div className={"whitespace-nowrap"}>Yesterday</div>
            <div className={"text-stone-400 text-md"}>
              US$
              {roundUp(data?.cost?.yesterday || 0, 6)}
            </div>
          </div>
        </div>
        <div className={"h-full w-full mt-4"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.charts || []}>
              <Tooltip />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: "12px" }}
                tickFormatter={(value, index) => value.slice(-4)}
              />
              <Bar dataKey="total_cost" fill="#8884d8" minPointSize={1} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={"flex-1 h-full text-sm text-stone-800 shrink-0"}>
        <div className={"h-[50%]"}>
          <div className={"space-y-1"}>
            <div className={"whitespace-nowrap"}>Estimate cost this month</div>
            <div className={"text-stone-800 text-xl"}>
              US$
              {roundUp(data?.estimate?.month || 0, 6)}
            </div>
          </div>
        </div>
        <div className={"h-[50%]"}>
          <div className={"space-y-1"}>
            <div className={"whitespace-nowrap"}>Advance pay balance</div>
            <div
              className={`${
                data?.advance_pay?.balance < 0
                  ? "text-red-500"
                  : "text-stone-800"
              }  text-xl`}
            >
              US$
              {roundUp(data?.advance_pay?.balance || 0, 6)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSR;
