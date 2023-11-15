import { Metadata } from "next";
import { ReactNode } from "react";
import Dock from "@/app/components/Dock";
import Toolbar from "@/app/components/Toolbar";
import PrimaryNav from "@/app/components/Nav/PrimaryNav";
import SecondaryNav from "@/app/chat/[[...id]]/SecondaryNav";
import dynamic from "next/dynamic";
const ModelSwitch = dynamic(() => import("@/app/components/ModelSwitch"));

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
        <div className={"w-full h-full lg:mr-10 relative"}>
          <Toolbar border={false}>
            <ModelSwitch />
          </Toolbar>
          {props.children}
        </div>
      </div>
      <Dock />
    </div>
  );
}
