"use client";
import React, { FC } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton";
import useSWR from "swr";

const SettingPopover = dynamic(
  () => import("@/app/components/SettingPopover"),
  {
    loading: () => (
      <Skeleton width={"36px"} height={"20px"} className={"p-1"} />
    ),
  },
);

const Toolbar: FC<{ border?: boolean; children?: React.ReactNode }> = (
  props,
) => {
  const { data, isLoading } = useSWR(
    "/api/customer",
    (url) => fetch(url).then((res) => res.json()),
    {
      refreshInterval: 3_000,
    },
  );

  return (
    <div
      className={`hidden h-[60px] w-full md:flex items-center justify-between px-6 xl:px-10 gap-8 ${
        props.border ? "border-b" : ""
      }`}
    >
      <div
        className={"text-sm font-semibold flex items-center space-x-1 w-full"}
      >
        <div className={"w-full"}>{props?.children}</div>
        {!isLoading && !data?.subscription?.isPremium && (
          <Link
            href={"/premium"}
            prefetch
            className={
              "hover:shadow-lg px-4 py-2 text-sm rounded-full bg-gradient-to-tr from-[#AB68FF] to-[#0066FF] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 whitespace-nowrap"
            }
          >
            Explore Premium
          </Link>
        )}
        <Link
          href={
            "https://www.abandon.ai/docs/resource/Introduction/introduction"
          }
          target={"_blank"}
          className={
            "hover:bg-gray-100 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          }
        >
          <QuestionMarkCircleIcon className={"w-5 h-5 text-gray-800"} />
        </Link>
        <SettingPopover />
      </div>
    </div>
  );
};

export default Toolbar;
