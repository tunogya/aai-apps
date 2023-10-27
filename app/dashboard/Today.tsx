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
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";

const CSR = () => {
  const { user } = useUser();
  const { data: balanceData } = useSWR("/api/dashboard/balance", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"flex flex-col gap-2 xl:gap-8"}>
      <div
        className={
          "flex gap-2 w-full py-1 xl:border-b text-gray-800 justify-between"
        }
      >
        <div className={"text-[28px] font-semibold"}>Today</div>
      </div>
      <div className={"flex h-[230px] w-full"}>
        <div className={"flex flex-col max-w-[760px] h-[230px] w-full gap-1"}>
          <div className={"flex gap-20 h-[70px]"}>
            <div className={"flex flex-col gap-1"}>
              <div className={"flex justify-between items-center text-sm"}>
                <div className={"text-gray-600"}>Gross costs</div>
              </div>
              <div className={"text-xl text-gray-800 select-text"}>$0</div>
            </div>
            <div className={"flex flex-col gap-1"}>
              <div className={"flex justify-between items-center text-sm"}>
                <div className={"text-gray-600"}>Yesterday</div>
              </div>
              <div className={"text-gray-400 select-text"}>$0</div>
            </div>
          </div>
          <div className={"flex-1"}></div>
        </div>
        <div className={"flex flex-col flex-1"}>
          <div
            className={"h-[95px] pl-5 pb-5 w-full border-b flex flex-col gap-1"}
          >
            <div className={"flex justify-between items-center text-sm"}>
              <div className={"text-gray-700"}>USD Balance</div>
              <DepositButton className={"text-[#0066FF]"} />
            </div>
            <div className={"text-xl text-gray-800 select-text"}>
              {balanceData?.balance < 0 ? "-" : ""}$
              {roundUp(Math.abs(balanceData?.balance) || 0, 6)}
            </div>
            <div className={"text-xs text-gray-400"}>Your balance</div>
          </div>
          <div className={"h-[95px] pl-5 pt-5 w-full flex flex-col gap-1"}>
            <div className={"flex justify-between items-center text-sm"}>
              <div className={"text-gray-700"}>Credit Points</div>
              <div className={"text-[#0066FF]"}>View</div>
            </div>
            <div className={"text-xl text-gray-800 select-text"}>
              {roundUp(Math.abs(balanceData?.credit) || 0, 6)} ABD
            </div>
            <div className={"text-xs text-gray-400"}>
              Abandon credit points.
            </div>
          </div>
        </div>
        {/*<div*/}
        {/*  className={*/}
        {/*    "flex flex-col w-full xl:w-96 h-full text-sm text-gray-800 gap-3 xl:gap-10"*/}
        {/*  }*/}
        {/*>*/}
        {/*  <div*/}
        {/*    className={*/}
        {/*      "w-full xl:w-[200px] space-y-1 border p-3 xl:border-none xl:p-0 rounded-xl shadow-sm md:shadow-none"*/}
        {/*    }*/}
        {/*  >*/}
        {/*    <div className={"whitespace-nowrap text-xs md:text-sm"}>*/}
        {/*      Balance*/}
        {/*    </div>*/}
        {/*    <div*/}
        {/*      className={*/}
        {/*        "flex w-full gap-2 flex-row md:flex-col justify-between md:justify-start"*/}
        {/*      }*/}
        {/*    >*/}
        {/*      <div*/}
        {/*        className={`${*/}
        {/*          balanceData?.balance < 0*/}
        {/*            ? "text-red-500"*/}
        {/*            : "text-[#0066FF] md:text-gray-800"*/}
        {/*        }  text-xl md:pb-0`}*/}
        {/*      >*/}
        {/*        {balanceData?.balance < 0 ? "-" : ""}US$*/}
        {/*        {roundUp(Math.abs(balanceData?.balance) || 0, 6)}*/}
        {/*      </div>*/}
        {/*      <DepositButton*/}
        {/*        className={`text-sm px-2 py-1 rounded-lg text-white bg-[#0066FF] font-semibold flex items-center gap-1 w-fit`}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div*/}
        {/*    className={*/}
        {/*      "w-full xl:w-[200px] space-y-1 border p-3 xl:border-none xl:p-0 rounded-xl shadow-sm md:shadow-none"*/}
        {/*    }*/}
        {/*  >*/}
        {/*    <div className={"whitespace-nowrap text-xs md:text-sm"}>*/}
        {/*      Credit Points*/}
        {/*    </div>*/}
        {/*    <div className={"text-xl text-[#0066FF] md:text-gray-800"}>*/}
        {/*      {roundUp(Math.abs(balanceData?.credit) || 0, 6)} ABD*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default CSR;
