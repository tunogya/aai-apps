"use client";

import useSWR from "swr";
import React from "react";
import CheckoutButton from "@/app/components/CheckoutButton";

const CSR = () => {
  const { data, isLoading } = useSWR("/api/billing", (url) =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json()),
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
        <div className={"text-3xl text-gray-800"}>$0.00</div>
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
          {data?.session?.url && (
            <a href={data.session.url} className={""}>
              <div
                className={
                  "bg-gray-100 text-gray-800 rounded w-fit px-3 py-1.5 font-medium cursor-pointer text-sm"
                }
              >
                Manage Billing
              </div>
            </a>
          )}
        </div>
      </div>
      <div className={"pt-8"}>
        <div className={"p-4 border w-fit min-w-[400px] rounded space-y-2"}>
          <div className={"text-lg font-semibold text-gray-800"}>
            My balance
          </div>
          <div className={"text-3xl text-gray-800"}>0.00 AAI</div>
          <div className={"flex gap-2"}>
            <div
              className={
                "px-3 py-1.5 bg-gray-100 text-gray-800 rounded text-sm font-medium flex items-center gap-1"
              }
            >
              <div>Deposit</div>
            </div>
            <div
              className={
                "px-3 py-1.5 bg-gray-100 text-gray-800 rounded text-sm font-medium flex items-center gap-1"
              }
            >
              <div>Withdraw</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSR;
