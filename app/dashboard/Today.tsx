"use client";
import React, { useState } from "react";
import useSWR from "swr";
import {
  XAxis,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Tooltip,
} from "recharts";
import { roundUp } from "@/utils/roundUp";
import { useSearchParams } from "next/navigation";

const CSR = () => {
  const { data } = useSWR("/api/dashboard/today", (url) =>
    fetch(url).then((res) => res.json()),
  );
  const { data: balanceData } = useSWR("/api/dashboard/balance", (url) =>
    fetch(url).then((res) => res.json()),
  );

  const searchParams = useSearchParams();
  const model = searchParams.get("model") || "gpt-3.5-turbo";
  const isPurple = model.startsWith("gpt-4");
  const [status, setStatus] = useState("idle");

  return (
    <div className={"flex flex-col xl:flex-row gap-10 h-fit w-full"}>
      <div className={"w-full xl:max-w-3xl h-full text-sm text-black"}>
        <div className={"flex w-full gap-10"}>
          <div className={"w-[200px] space-y-1"}>
            <div className={"whitespace-nowrap"}>Cost & usage</div>
            <div className={"text-black text-xl"}>
              US$
              {roundUp(data?.cost?.today || 0, 6)}
            </div>
          </div>
          <div className={"w-[200px] space-y-1"}>
            <div className={"whitespace-nowrap"}>Yesterday</div>
            <div className={"text-gray-400 text-md"}>
              US$
              {roundUp(data?.cost?.yesterday || 0, 6)}
            </div>
          </div>
        </div>
        <div className={"h-[128px] w-full mt-4"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.daily || []}>
              <CartesianGrid strokeOpacity={0.5} horizontal={false} />
              <Tooltip
                label={"date"}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  value,
                  (name as string).toUpperCase().replace("_", "."),
                ]}
                itemStyle={{
                  fontSize: "10px",
                  margin: "0px",
                  padding: "0px",
                }}
                wrapperStyle={{
                  fontSize: "10px",
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
                tick={{ fontSize: "12px" }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Bar
                stackId="a"
                strokeWidth={2}
                dataKey={"gpt4"}
                fill={"#AB68FF"}
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
      <div
        className={
          "flex flex-row xl:flex-col w-96 h-full text-sm text-black gap-20 xl:gap-10"
        }
      >
        <div className={"w-[200px] space-y-1"}>
          <div className={"whitespace-nowrap"}>Total cost this month</div>
          <div className={"text-black text-xl"}>
            US$
            {roundUp(data?.cost?.month || 0, 6)}
          </div>
        </div>
        <div className={"w-[200px] space-y-1"}>
          <div className={"whitespace-nowrap"}>Advance pay balance</div>
          <div
            className={`${
              balanceData?.balance < 0 ? "text-red-500" : "text-black"
            }  text-xl`}
          >
            {balanceData?.balance < 0 ? "-" : ""}US$
            {roundUp(Math.abs(balanceData?.balance) || 0, 6)}
          </div>
          <button
            className={`text-sm px-2 py-1 rounded text-white ${
              isPurple ? "bg-[#AB68FF]" : "bg-[#19C37D]"
            } font-semibold flex items-center gap-1`}
            onClick={async () => {
              try {
                setStatus("loading");
                const { session } = await fetch(`/api/checkout`, {
                  method: "POST",
                }).then((res) => res.json());
                const url = session.url;
                setStatus("idle");
                window.open(url);
              } catch (e) {
                console.log(e);
                setStatus("error");
                setTimeout(() => {
                  setStatus("idle");
                }, 3_000);
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
            {status === "idle" && "Deposit"}
            {status === "loading" && "Waiting..."}
            {status === "error" && "Error"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSR;
