"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import dysortid from "@/app/utils/dysortid";
import React, { useEffect } from "react";
import Skeleton from "react-loading-skeleton";

const CSR = () => {
  const router = useRouter();
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
        <div className={"text-gray-500"}>
          You&apos;ll be billed at the end of each calendar month for usage
          during that month.
        </div>
      </div>
      <div className={"flex w-full gap-2"}>
        <div
          className={
            "bg-gray-100 text-gray-800 rounded w-fit px-3 py-1.5 font-medium cursor-pointer text-sm"
          }
        >
          Buy AAI
        </div>
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
  );
};

export default CSR;
