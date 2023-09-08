import { Metadata } from "next";
import { ReactNode } from "react";
import Dock from "@/components/Dock";
import Toolbar from "@/components/Toolbar";
import PrimaryNav from "@/components/Nav/PrimaryNav";

export const runtime = "edge";

const title = "Billing - AbandonAI";
const description = "Powered by OpenAI";

export const metadata: Metadata = {
  title,
  description,
};

export default function Layout(props: { children: ReactNode }) {
  return (
    <div className={"h-full w-full flex relative justify-center"}>
      <div className={"max-w-[1920px] w-full h-full flex"}>
        <PrimaryNav active={"/billing"} />
        <div className={"w-full px-8 mr-10 space-y-2"}>
          <Toolbar />
          {props.children}
        </div>
      </div>
      <Dock />
    </div>
  );
}
