"use client";
import React from "react";
import useSWR from "swr";
import {
  XAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
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
    <div className={"flex flex-col xl:flex-row gap-10 h-fit w-full"}>
      <div className={"w-full xl:max-w-3xl h-full text-sm text-stone-800"}>
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
        <div className={"h-[128px] w-full mt-4"}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.charts || []}>
              <CartesianGrid strokeOpacity={0.5} horizontal={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: "10px" }}
                tickFormatter={(value, index) => value.slice(-4)}
              />
              <Line
                strokeWidth={2}
                dataKey={"total_cost"}
                dot={false}
                stroke={isPurple ? "#AB68FF" : "#19C37D"}
              />
            </LineChart>
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
            }  text-xl font-bold`}
          >
            US$
            {roundUp(data?.advance_pay?.balance || 0, 6)}
          </div>
          <button
            className={`text-sm px-2 py-1 rounded border text-stone-700 font-semibold hover:border-stone-300 flex items-center gap-1`}
            onClick={async () => {
              try {
                const { session } = await fetch(`/api/checkout`, {
                  method: "POST",
                }).then((res) => res.json());
                const url = session.url;
                window.open(url);
              } catch (e) {
                console.log(e);
              }
            }}
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Credit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSR;
