"use client";
import React from "react";
import useSWR from "swr";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { roundUp } from "@/utils/roundUp";

export const TodayCost = () => {
  const { data: costData } = useSWR("/api/dashboard/cost", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"text-gray-400 select-text"}>
      ${costData?.yesterday || "0"}
    </div>
  );
};

export const YesterdayCost = () => {
  const { data: costData } = useSWR("/api/dashboard/cost", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"text-gray-400 select-text"}>
      ${costData?.yesterday || "0"}
    </div>
  );
};

export const Chart = () => {
  const { data: todayData } = useSWR("/api/dashboard/today", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
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
          <Bar stackId="a" strokeWidth={2} dataKey={"gpt4"} fill={"#AB68FF"} />
          <Bar
            stackId="a"
            strokeWidth={2}
            dataKey={"gpt3_5"}
            fill={"#19C37D"}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const USDBalance = () => {
  const { data: balanceData } = useSWR("/api/dashboard/balance", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"text-xl text-gray-800 select-text"}>
      {balanceData?.balance < 0 ? "-" : ""}$
      {roundUp(Math.abs(balanceData?.balance) || 0, 6)}
    </div>
  );
};

export const CreditBalance = () => {
  const { data: balanceData } = useSWR("/api/dashboard/balance", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"text-xl text-gray-800 select-text"}>
      {roundUp(Math.abs(balanceData?.credit) || 0, 6)} ABD
    </div>
  );
};
