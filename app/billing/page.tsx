"use client";

import React from "react";
import CheckoutButton from "@/app/components/CheckoutButton";
import ManageBillingButton from "@/app/components/ManageBillingButton";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";

const CSR = () => {
  const { data: customer } = useSWR("/api/customer", (url) =>
    fetch(url).then((res) => res.json()),
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
          <div className={"text-3xl text-gray-800"}>
            {((-1 * customer?.balance) / 100).toFixed(2)} AAI
          </div>
        ) : (
          <div className={"max-w-[160px] w-full"}>
            <Skeleton count={1} className={"h-8"} />
          </div>
        )}
        <div className={"pt-1 pb-4 text-gray-500 flex items-center gap-2"}>
          <div>1 AAI = 1 USD.</div>
        </div>
        <div className={"flex w-full gap-2"}>
          <CheckoutButton
            price={process.env.NEXT_PUBLIC_AAI_CREDIT_PRICE!}
            title={"Buy AAI credit"}
            className={
              "bg-gray-100 text-gray-800 rounded w-fit px-3 py-1.5 font-medium cursor-pointer text-sm"
            }
          />
          <ManageBillingButton
            title={"Manage billing"}
            className={
              "bg-gray-100 text-gray-800 rounded w-fit px-3 py-1.5 font-medium cursor-pointer text-sm"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CSR;
