import { Metadata } from "next";
import React, { ReactNode } from "react";
import Toolbar from "@/app/components/Toolbar";
import PrimaryNav from "@/app/components/Nav/PrimaryNav";
import SecondaryNav from "@/app/chat/[[...id]]/SecondaryNav";
import dynamic from "next/dynamic";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
const ModelSwitch = dynamic(() => import("@/app/components/ModelSwitch"), {
  loading: () => <Skeleton width={"90px"} height={"20px"} className={"p-1"} />,
});

export const runtime = "edge";

const title = "ChatGPT";
const description = "Powered by OpenAI";

export const metadata: Metadata = {
  title,
  description,
};

export default function Layout(props: { children: ReactNode }) {
  return (
    <div className={"h-full w-full flex relative justify-center"}>
      <div className={"max-w-[1920px] w-full h-full flex overflow-hidden"}>
        <PrimaryNav />
        <SecondaryNav />
        <div className={"w-full h-full relative"}>
          <Toolbar border={false}>
            <div className={"flex items-center lg:justify-end justify-between"}>
              <Link
                href={`/chat`}
                prefetch
                className={
                  "flex lg:hidden items-center hover:bg-gray-100 rounded cursor-pointer select-none m-2 text-gray-800 px-2 py-1.5"
                }
              >
                <div className={"p-1"}>
                  <PlusIcon className={"w-4 h-4 stroke-2"} />
                </div>
                <div className={"text-sm font-medium text-gray-800"}>
                  New Chat
                </div>
              </Link>
              <ModelSwitch />
            </div>
          </Toolbar>
          {props.children}
        </div>
      </div>
    </div>
  );
}
