"use client";

import Link from "next/link";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { roundUp } from "@/utils/roundUp";
import React, { useState } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import dynamic from "next/dynamic";

const TopUpButton = dynamic(() => import("@/components/TopUpButton"), {
  ssr: false,
});
const ModelSwitch = dynamic(() => import("@/components/ModelSwitch"), {
  ssr: false,
});

const CSR = () => {
  const searchParams = useSearchParams();
  const [showMore, setShowMore] = useState(false);

  return (
    <div className={"space-y-2"}>
      <div className={"flex items-center justify-between px-4 border-t"}>
        <Link
          href={`/chat?model=${searchParams.get("model") || "gpt-3.5-turbo"}`}
          prefetch
          className={
            "flex items-center rounded cursor-pointer select-none md:hidden"
          }
        >
          <div className={"w-5 shrink-0"}>
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
        </Link>
        <ModelSwitch />
        <button onClick={() => setShowMore(!showMore)} className={"md:hidden"}>
          <ChevronUpIcon
            className={`w-5 h-5 ${showMore ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </div>
  );
};

export default CSR;
