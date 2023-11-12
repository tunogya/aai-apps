"use client";
import React, { FC } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import dynamic from "next/dynamic";

const ModelSwitch = dynamic(() => import("@/app/components/ModelSwitch"));
const SettingPopover = dynamic(() => import("@/app/components/SettingPopover"));
const SearchBar = dynamic(() => import("@/app/components/SearchBar"));

const Toolbar: FC<{ border?: boolean }> = (props) => {
  return (
    <div
      className={`hidden h-[60px] w-full md:flex items-center justify-between px-4 md:px-10 gap-8 ${
        props.border ? "border-b" : ""
      }`}
    >
      <div className={"relative w-full max-w-[40vw]"}>
        <SearchBar />
      </div>
      <div className={"text-sm font-semibold flex items-center space-x-1"}>
        <ModelSwitch />
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
