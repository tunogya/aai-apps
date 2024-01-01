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
  const { data: upcomingInvoices } = useSWR("/api/invoices/upcoming", (url) =>
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
        <div className={"text-lg font-semibold text-gray-800 pb-1"}>
          Pending invoice
        </div>
        {upcomingInvoices?.amount_due !== undefined ? (
          <div className={"text-3xl text-gray-800"}>
            ${upcomingInvoices?.amount_due.toFixed(2)}
          </div>
        ) : (
          <div className={"max-w-[120px] w-full"}>
            <Skeleton count={1} className={"h-8"} />
          </div>
        )}
        <div className={"pb-4 text-gray-500"}>
          You&apos;ll be billed at the end of each calendar month for usage
          during that month.
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
      <div className={"pt-8"}>
        <div className={"p-4 border max-w-xl rounded space-y-2"}>
          <div className={"text-lg font-semibold text-gray-800"}>
            My credit balance
          </div>
          <div className={"pb-2"}>
            {customer?.balance !== undefined ? (
              <div className={"text-3xl text-gray-800"}>
                {((-1 * customer?.balance) / 100).toFixed(2)} AAI
              </div>
            ) : (
              <div className={"max-w-[160px] w-full"}>
                <Skeleton count={1} className={"h-8"} />
              </div>
            )}
            <div className={"text-gray-500"}>
              1 AAI = 1 USD, AAI can be used to offset your bill.
            </div>
          </div>
          <div className={"flex gap-2"}>
            <button
              disabled
              className={
                "px-3 py-1.5 bg-gray-100 text-gray-800 rounded text-sm font-medium flex items-center gap-1 disabled:cursor-auto"
              }
            >
              <div>Deposit</div>
            </button>
            <button
              disabled
              className={
                "px-3 py-1.5 bg-gray-100 text-gray-800 rounded text-sm font-medium flex items-center gap-1 disabled:cursor-auto"
              }
            >
              <div>Withdraw</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSR;
