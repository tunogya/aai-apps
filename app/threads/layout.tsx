import { Metadata } from "next";
import React, { ReactNode } from "react";
import Toolbar from "@/app/components/Toolbar";
import PrimaryNav from "@/app/components/Nav/PrimaryNav";
import SecondaryNav from "@/app/chat/[[...id]]/SecondaryNav";
import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton";
const ModelSwitch = dynamic(() => import("@/app/components/ModelSwitch"), {
  loading: () => <Skeleton width={"90px"} height={"20px"} className={"p-1"} />,
});

export const runtime = "edge";

const title = "Threads";
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
        <div className={"w-full h-full relative"}>
          <Toolbar border={false} />
          {props.children}
        </div>
      </div>
    </div>
  );
}
