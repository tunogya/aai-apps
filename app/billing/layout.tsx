import { Metadata } from "next";
import { ReactNode } from "react";
import Toolbar from "@/app/components/Toolbar";
import PrimaryNav from "@/app/components/Nav/PrimaryNav";

export const runtime = "edge";

const title = "Billing";
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
        <div className={"w-full relative"}>
          <Toolbar />
          {props.children}
        </div>
      </div>
    </div>
  );
}
