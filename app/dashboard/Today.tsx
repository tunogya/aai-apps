"use client";
import React from "react";
import useSWR from "swr";
import {
  XAxis,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Tooltip,
  YAxis,
} from "recharts";
import { roundUp } from "@/utils/roundUp";
import numeral from "numeral";
import { DepositButton } from "@/components/DepositButton";
import moment from "moment";

const CSR = () => {
  const { data } = useSWR("/api/dashboard/today", (url) =>
    fetch(url).then((res) => res.json()),
  );
  const { data: balanceData } = useSWR("/api/dashboard/balance", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"flex flex-col xl:flex-row gap-4 md:gap-10 h-fit w-full"}>
      <div className={"w-full xl:max-w-3xl h-full text-sm text-black"}>
        <div className={"flex w-full flex-col md:flex-row gap-3"}>
          <div
            className={
              "w-full md:w-[200px] space-y-1 border p-3 md:border-none md:p-0 rounded"
            }
          >
            <div className={"whitespace-nowrap"}>Cost & usage</div>
            <div className={"text-black text-xl"}>
              US$
              {roundUp(data?.cost?.today || 0, 6)}
            </div>
          </div>
          <div
            className={
              "w-full md:w-[200px] space-y-1 border p-3 md:border-none md:p-0 rounded"
            }
          >
            <div className={"whitespace-nowrap"}>Yesterday</div>
            <div className={"text-gray-400 text-md"}>
              US$
              {roundUp(data?.cost?.yesterday || 0, 6)}
            </div>
          </div>
        </div>
        <div className={"h-[200px] md:h-[128px] w-full mt-4"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.daily || []}>
              <CartesianGrid strokeOpacity={0.5} horizontal={false} />
              <Tooltip
                label={"date"}
                labelFormatter={(value) =>
                  moment(new Date(value)).format("ll").split(",")[0]
                }
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
              <YAxis
                axisLine={{
                  stroke: "#c9c9c9",
                }}
                tickLine={{
                  stroke: "#c9c9c9",
                }}
                tickFormatter={(value, index) => {
                  return numeral(value).format("$0.0a").toUpperCase();
                }}
                width={30}
                tick={{ fontSize: "10px" }}
              />
              <XAxis
                dataKey="date"
                axisLine={{
                  stroke: "#c9c9c9",
                }}
                tickLine={{
                  stroke: "#c9c9c9",
                }}
                tick={{ fontSize: "10px" }}
                tickFormatter={(value) =>
                  moment(new Date(value)).format("ll").split(",")[0]
                }
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
          "flex flex-col md:flex-row xl:flex-col w-full md:w-96 h-full text-sm text-black gap-3 xl:gap-10"
        }
      >
        <div
          className={
            "w-full md:w-[200px] space-y-1 border p-3 md:border-none md:p-0 rounded"
          }
        >
          <div className={"whitespace-nowrap"}>Total cost this month</div>
          <div className={"text-black text-xl"}>
            US$
            {roundUp(data?.cost?.month || 0, 6)}
          </div>
        </div>
        <div
          className={
            "w-full md:w-[200px] space-y-1 border p-3 md:border-none md:p-0 rounded"
          }
        >
          <div className={"whitespace-nowrap"}>Advance pay balance</div>
          <div
            className={`${
              balanceData?.balance < 0 ? "text-red-500" : "text-black"
            }  text-xl`}
          >
            {balanceData?.balance < 0 ? "-" : ""}US$
            {roundUp(Math.abs(balanceData?.balance) || 0, 6)}
          </div>
          <DepositButton
            className={`text-sm py-2 px-3 md:py-1 rounded text-white bg-[#0066FF] font-semibold flex items-center gap-1 w-full md:w-fit`}
          />
        </div>
      </div>
    </div>
  );
};

export default CSR;
