"use client";

import Link from "next/link";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { PlusIcon } from "@heroicons/react/24/outline";

// const TopUpButton = dynamic(() => import("@/app/components/TopUpButton"));
const ModelSwitch = dynamic(() => import("@/app/components/ModelSwitch"));

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
            <PlusIcon className={"h-4 w-4 stroke-2"} />
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
