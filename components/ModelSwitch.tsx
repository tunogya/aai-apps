"use client";
import { Switch } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import useSWR from "swr";
import { roundUp } from "@/utils/roundUp";
import { DepositButton } from "@/components/DepositButton";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

const ModelSwitch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [useGPT4, setUseGPT4] = useState(searchParams.get("model") === "GPT-4");
  const [showMore, setShowMore] = useState(false);
  const { data: balanceData } = useSWR("/api/dashboard/balance", (url) =>
    fetch(url).then((res) => res.json()),
  );
  const { user } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (useGPT4) {
      params.set("model", "GPT-4");
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      params.set("model", "GPT-3.5");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [useGPT4]);

  useEffect(() => {
    if (searchParams.get("model") === "GPT-4") {
      setUseGPT4(true);
    } else {
      setUseGPT4(false);
    }
  }, [searchParams]);

  return (
    <div className={"text-sm md:font-semibold border-t md:border-none"}>
      <div
        className={
          "flex items-center space-x-2 py-2 px-4 rounded select-none w-full justify-between"
        }
      >
        <Link
          href={`/chat?model=${searchParams.get("model") || "GPT-3.5"}`}
          prefetch
          className={
            "flex items-center hover:bg-gray-50 rounded cursor-pointer select-none m-2"
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
        <div
          className={"flex gap-2 cursor-pointer"}
          onClick={() => setUseGPT4(!useGPT4)}
        >
          <div
            className={`flex space-x-1 text-sm ${
              useGPT4 ? "text-[#AB68FF]" : "text-gray-800"
            }`}
          >
            <div className={"whitespace-nowrap text-end text-xs"}>
              GPT-4 Model
            </div>
          </div>
          <Switch
            checked={useGPT4}
            className={`${useGPT4 ? "bg-[#AB68FF]" : "bg-gray-200"}
          relative inline-flex h-[14px] w-[24px] shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className="sr-only">GPT-4 Model</span>
            <span
              aria-hidden="true"
              className={`${useGPT4 ? "translate-x-2.5" : "translate-x-0"}
            pointer-events-none inline-block h-[12px] w-[12px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        <button onClick={() => setShowMore(!showMore)}>
          <ChevronUpIcon
            className={`w-5 h-5 ${showMore ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      {showMore && (
        <div className={"px-4 pb-2 text-xs text-gray-800"}>
          <div className={"flex justify-between"}>
            <div>USD Balance: ${roundUp(balanceData?.balance || 0, 6)}</div>
            <DepositButton className={"text-[#0066FF]"} />
          </div>
          <div>Credit Points: {roundUp(balanceData?.credit || 0, 6)} ABD</div>
          <div className={"mt-1 flex items-center justify-between"}>
            <div>{user?.email}</div>
            <a href={"/api/auth/logout"} className={"text-red-500"}>
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSwitch;
