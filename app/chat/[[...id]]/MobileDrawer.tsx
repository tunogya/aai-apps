"use client";

import Link from "next/link";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import dysortid from "@/app/utils/dysortid";
import useSWR from "swr";
import { useUser } from "@auth0/nextjs-auth0/client";
import dynamic from "next/dynamic";
const TopUpButton = dynamic(() => import("@/app/components/TopUpButton"), {
  loading: () => <div className={"h-5"} />,
});
const ManageBillingButton = dynamic(
  () => import("@/app/components/ManageBillingButton"),
  {
    loading: () => <div className={"h-5"} />,
  },
);

const ModelSwitch = dynamic(() => import("@/app/components/ModelSwitch"));

const CSR = () => {
  const { user } = useUser();
  const [showMore, setShowMore] = useState(false);
  const { data, isLoading } = useSWR("/api/customer", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"space-y-0"}>
      <div
        className={
          "flex items-center justify-between px-4 border-y bg-white h-10"
        }
      >
        <Link
          href={`/chat/${dysortid()}`}
          prefetch
          className={
            "flex items-center rounded cursor-pointer select-none md:hidden"
          }
        >
          <div className={"w-5 shrink-0"}>
            <PlusIcon className={"h-4 w-4 stroke-2"} />
          </div>
        </Link>
        {!isLoading && !data.subscription.isPremium ? (
          <Link
            href={"/premium"}
            prefetch
            className={
              "hover:shadow-lg px-2 py-1 text-sm rounded-full bg-gradient-to-tr from-[#AB68FF] to-[#0066FF] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 whitespace-nowrap"
            }
          >
            Explore Premium
          </Link>
        ) : (
          <ModelSwitch />
        )}
        <button onClick={() => setShowMore(!showMore)} className={"md:hidden"}>
          <ChevronUpIcon
            className={`w-5 h-5 ${showMore ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      {showMore && (
        <div
          className={"pb-8 max-h-[80vh] overflow-y-auto text-sm font-medium"}
        >
          <div className={"flex justify-between border-b py-2 px-4"}>
            <div className={"text-gray-500"}>User</div>
            <div className={"text-gray-800 truncate"}>
              {user?.email || "N/A"}
            </div>
          </div>
          <div className={"flex justify-between border-b py-2 px-4"}>
            <div className={"text-gray-500"}>Subscription</div>
            <div
              className={`${
                data?.subscription?.isPremium
                  ? "text-[#AB68FF]"
                  : "text-gray-800"
              } truncate`}
            >
              {data?.subscription?.name || "N/A"}
            </div>
          </div>
          <div className={"flex justify-between border-b py-2 px-4"}>
            <div className={"text-gray-500"}>Credit remaining</div>
            <div className={"text-gray-800 truncate"}>
              {isLoading ? "N/A" : `$${(data?.customer?.balance / 100) * -1}`}
            </div>
          </div>
          <div className={"flex justify-center border-b py-2 px-4"}>
            <ManageBillingButton className={"text-[#0066FF]"} />
          </div>
          <div className={"flex justify-center border-b py-2 px-4"}>
            <TopUpButton className={"text-[#0066FF]"} />
          </div>
          <div className={"flex justify-center border-b py-2 px-4"}>
            <Link
              href={"/premium"}
              prefetch
              target={"_blank"}
              className={"text-[#AB68FF]"}
            >
              Explore Premium
            </Link>
          </div>
          <div className={"flex justify-center border-b py-2 px-4"}>
            <a href={"/api/auth/logout"} className={"text-red-500"}>
              Log out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSR;
