import { Metadata } from "next";
import { ReactNode } from "react";
import Dock from "@/components/Dock";
import Toolbar from "@/components/Toolbar";
import PrimaryNav from "@/components/Nav/PrimaryNav";

export const runtime = "edge";

const title = "Dashboard";
const description = "Powered by OpenAI";

export const metadata: Metadata = {
  title,
  description,
};

export default function Layout(props: { children: ReactNode }) {
  return (
    <div className={"h-full w-full flex relative justify-center select-none"}>
      <div className={"max-w-[1920px] w-full h-full flex overflow-hidden"}>
        <div className={"w-full relative"}>{props.children}</div>
      </div>
    </div>
  );
}