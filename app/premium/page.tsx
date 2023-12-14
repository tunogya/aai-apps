"use client";

import React from "react";
import Link from "next/link";
import dysortid from "@/app/utils/dysortid";

const CSR = () => {
  return (
    <div className={"w-full h-full p-2 md:p-4 relative"}>
      <div className={"p-2 md:p-8 md:border rounded-lg"}>
        {/* @ts-ignore */}
        <stripe-pricing-table
          publishable-key="pk_live_51MagF9FPpv8QfieYNE5ZeIQQTIFXZxdRHKyHo8xmWXkYKnYyXKoaxh6BEs5JuNIpgAWU5FNt7d5gyhRrVsxFtqxL00vTDy0spV"
          pricing-table-id="prctbl_1ON4GZFPpv8QfieYARNF5SMG"
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
