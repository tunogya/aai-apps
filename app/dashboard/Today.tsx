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
      <div
        className={
          "w-full xl:max-w-3xl h-full text-sm border rounded-xl p-3 xl:p-0 xl:border-none bg-gray-50 md:bg-white"
        }
      >
        <div className={"flex w-full flex-row gap-3"}>
          <div className={"w-full xl:w-[200px] space-y-1"}>
            <div className={"whitespace-nowrap text-xs md:text-sm"}>
              Cost & usage
            </div>
            <div className={"text-xl text-[#0066FF] md:text-gray-800"}>
              US$
              {roundUp(data?.cost?.today || 0, 6)}
            </div>
          </div>
          {data?.cost?.yesterday ? (
            <div
              className={"w-full xl:w-[200px] space-y-1 text-end md:text-start"}
            >
              <div className={"whitespace-nowrap text-xs md:text-sm"}>
                Yesterday
              </div>
              <div className={"text-gray-400 text-md"}>
                US$
                {roundUp(data?.cost?.yesterday || 0, 6)}
              </div>
            </div>
          ) : null}
        </div>
        <div className={"h-[128px] w-full mt-4"}>
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
                height={16}
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
          "flex flex-col md:flex-row xl:flex-col w-full xl:w-96 h-full text-sm text-gray-800 gap-3 xl:gap-10"
        }
      >
        <div
          className={
            "w-full xl:w-[200px] space-y-1 border p-3 xl:border-none xl:p-0 rounded-xl bg-gray-50 md:bg-white"
          }
        >
          <div className={"whitespace-nowrap text-xs md:text-sm"}>
            Total cost this month
          </div>
          <div className={"text-xl text-[#0066FF] md:text-gray-800"}>
            US$
            {roundUp(data?.cost?.month || 0, 6)}
          </div>
        </div>
        <div
          className={
            "w-full xl:w-[200px] space-y-1 border p-3 xl:border-none xl:p-0 rounded-xl bg-gray-50 md:bg-white"
          }
        >
          <div className={"whitespace-nowrap text-xs md:text-sm"}>
            Advance pay balance
          </div>
          <div
            className={
              "flex w-full gap-2 flex-row md:flex-col justify-between md:justify-start"
            }
          >
            <div
              className={`${
                balanceData?.balance < 0
                  ? "text-red-500"
                  : "text-[#0066FF] md:text-gray-800"
              }  text-xl md:pb-0`}
            >
              {balanceData?.balance < 0 ? "-" : ""}US$
              {roundUp(Math.abs(balanceData?.balance) || 0, 6)}
            </div>
            <DepositButton
              className={`text-sm px-2 py-1 rounded-lg text-white bg-[#0066FF] font-semibold flex items-center gap-1 w-fit`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSR;
