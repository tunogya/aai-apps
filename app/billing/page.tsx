"use client";

import React from "react";
import CheckoutButton from "@/app/components/CheckoutButton";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import moment from "moment/moment";

const CSR = () => {
  const { data: customer } = useSWR("/api/customer", (url) =>
    fetch(url).then((res) => res.json()),
  );
  const { data: balanceTransaction } = useSWR(
    "/api/customer/balanceTransactions",
    (url) => fetch(url).then((res) => res.json()),
  );

  return (
    <div
      className={
        "flex flex-col px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full overflow-y-auto space-y-4"
      }
    >
      <div
        className={
          "flex gap-2 w-full py-1 text-gray-800 justify-between items-center"
        }
      >
        <div className={"text-3xl font-semibold"}>Billing settings</div>
      </div>
      <div>
        <div className={"text-xl font-bold text-gray-800 pb-4"}>
          Pay as you go
        </div>
        <div className={"pb-1 flex items-center gap-2"}>
          <div className={"text-lg font-semibold text-gray-800"}>
            Credit remaining
          </div>
        </div>
        {customer?.balance !== undefined ? (
          <div className={"flex items-end gap-3"}>
            <div className={"text-3xl text-gray-800"}>
              {(-1 * customer?.balance) / 100} AAI
            </div>
            <div className={"text-sm text-gray-400"}>(1 AAI = 1 USD)</div>
          </div>
        ) : (
          <div className={"max-w-[160px] w-full"}>
            <Skeleton count={1} className={"h-8"} />
          </div>
        )}
        <div className={"pt-1 pb-4 text-gray-500 gap-2"}>
          <div>
            GPT-3.5 offers 2,500 free tokens per chat, while GPT-4 provides 500
            free tokens per chat.
          </div>
        </div>
        <div className={"flex w-full gap-2"}>
          <CheckoutButton
            price={process.env.NEXT_PUBLIC_AAI_CREDIT_PRICE!}
            title={"Buy AAI credit"}
            className={
              "bg-gray-100 text-gray-800 rounded-lg w-fit px-3 py-1.5 font-medium cursor-pointer text-sm hover:bg-gray-200"
            }
          />
        </div>
      </div>
      <div className={"pt-10 max-w-2xl"}>
        <div className={"py-2 pb-4 text-xl font-bold text-gray-800"}>
          Recent transactions
        </div>
        <div className={"w-full border rounded-lg h-[240px] overflow-y-auto"}>
          {balanceTransaction ? (
            balanceTransaction?.map((item: any, index: number) => (
              <div
                key={index}
                className={
                  "flex text-sm h-9 items-center border-b justify-between hover:bg-gray-50 px-4"
                }
              >
                <div className={"text-gray-600 font-semibold"}>
                  {item.amount < 0
                    ? `+${(item.amount / 100) * -1} AAI`
                    : `${(item.amount / 100) * -1} AAI`}
                </div>
                <div className={"text-gray-400 text-[13px]"}>
                  {moment(item.created * 1000)
                    .startOf("second")
                    .fromNow()}
                </div>
              </div>
            ))
          ) : (
            <div className={"px-1"}>
              <Skeleton count={5} className={"h-9"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSR;
