"use client";
import React, { FC } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Configure, InstantSearch } from "react-instantsearch";
import searchClient from "@/utils/searchClient";
import { useUser } from "@auth0/nextjs-auth0/client";
import dynamic from "next/dynamic";
import SettingPopover from "@/components/SettingPopover";

const CustomSearchBox = dynamic(() => import("@/components/CustomSearchBox"), {
  ssr: false,
});
const CustomHits = dynamic(() => import("@/components/CustomHits"), {
  ssr: false,
});
const ModelSwitch = dynamic(() => import("@/components/ModelSwitch"), {
  ssr: false,
});

const Toolbar: FC<{ border?: boolean }> = (props) => {
  const { user } = useUser();

  return (
    <div
      className={`hidden h-[60px] w-full md:flex items-center justify-between px-4 md:px-10 ${
        props.border ? "border-b" : ""
      }`}
    >
      <div className={"relative"}>
        <InstantSearch
          searchClient={searchClient}
          indexName={"chat_search"}
          stalledSearchDelay={500}
          insights={true}
        >
          <Configure
            hitsPerPage={10}
            facets={["author"]}
            facetFilters={[`author:${user?.sub}`]}
          />
          <CustomSearchBox />
          <CustomHits />
        </InstantSearch>
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
