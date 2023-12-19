"use client";
import React, { FC } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import SettingPopover from "@/app/components/SettingPopover";

const Toolbar: FC<{ border?: boolean; children?: React.ReactNode }> = (
  props,
) => {
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
        <Link
          href={"https://github.com/tunogya/abandonai-app/discussions"}
          target={"_blank"}
          className={
            "hover:bg-gray-100 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          }
        >
          <QuestionMarkCircleIcon
            className={"w-5 h-5 text-gray-800 stroke-1.5"}
          />
        </Link>
        <SettingPopover />
      </div>
    </div>
  );
};

export default Toolbar;
