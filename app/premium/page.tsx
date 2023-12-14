"use client";

import React from "react";
import Link from "next/link";
import dysortid from "@/app/utils/dysortid";
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
    <div className={"w-full h-full p-2 md:p-4 relative"}>
      <div className={"p-2 md:p-8 md:border rounded-lg"}>
        {/* @ts-ignore */}
        <stripe-pricing-table
          publishable-key="pk_live_51MagF9FPpv8QfieYNE5ZeIQQTIFXZxdRHKyHo8xmWXkYKnYyXKoaxh6BEs5JuNIpgAWU5FNt7d5gyhRrVsxFtqxL00vTDy0spV"
          pricing-table-id="prctbl_1ON4GZFPpv8QfieYARNF5SMG"
          customer-email={data.customer.email}
        />
      </div>
      <Link href={`/chat/${dysortid()}`}>
        <div className={"text-center absolute bottom-4 w-full underline"}>
          Back
        </div>
      </Link>
    </div>
  );
};

export default CSR;
