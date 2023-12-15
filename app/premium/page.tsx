"use client";

import React from "react";
import useSWR from "swr";

const CSR = () => {
  const { data, isLoading } = useSWR("/api/customer", (url) =>
    fetch(url).then((res) => res.json()),
  );

  if (isLoading || !data?.customer.email) {
    return (
      <div
        className={
          "w-full h-full flex flex-col items-center justify-center gap-3 animate-pulse text-gray-800"
        }
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 1024 1024"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M68 68V956H956V68H68ZM142 882V142H586V413.333L512 216H438L216 808H290L345.5 660H586V882H142ZM576.791 586H373.209L475 314.667L576.791 586Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={
        "w-full h-full md:h-[calc(100vh-60px)] p-2 md:p-4 relative flex flex-col space-y-4 overflow-y-auto"
      }
    >
      <div className={"p-2 md:p-8 md:border rounded-lg space-y-4 xl:space-y-8"}>
        <div className={"text-2xl xl:text-3xl font-semibold text-center"}>
          Affordable plans for any situation
        </div>
        <div className={"flex w-full justify-center space-x-2 items-center"}>
          <div className={"text-sm font-semibold"}>
            Your current plan:{" "}
            {data?.subscription?.product.startsWith("prod")
              ? "Premium"
              : "Free"}
          </div>
          {data?.subscription?.current_period_end && (
            <div className={"text-xs"}>
              (Expired:{" "}
              {new Date(
                data?.subscription?.current_period_end * 1000,
              ).toLocaleDateString()}
              )
            </div>
          )}
        </div>
        <div className={"pt-8"}>
          {/* @ts-ignore */}
          <stripe-pricing-table
            publishable-key="pk_live_51MagF9FPpv8QfieYNE5ZeIQQTIFXZxdRHKyHo8xmWXkYKnYyXKoaxh6BEs5JuNIpgAWU5FNt7d5gyhRrVsxFtqxL00vTDy0spV"
            pricing-table-id="prctbl_1ON4GZFPpv8QfieYARNF5SMG"
            customer-email={data.customer.email}
          />
        </div>
      </div>
    </div>
  );
};

export default CSR;
