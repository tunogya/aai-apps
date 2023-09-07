import { Metadata } from "next";
import { ReactNode } from "react";
import CoreNav from "@/components/CoreNav";
import RecentNav from "@/components/RecentNav";
import Dock from "@/components/Dock";
import Account from "@/components/Account";

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
        <div
          className={
            "w-full max-w-[260px] h-full border-r px-8 py-4 space-y-10"
          }
        >
          <Account />
          <CoreNav active={"/billing"} />
          <RecentNav />
        </div>
        <div className={"w-full px-8 py-4 mr-10"}>{props.children}</div>
      </div>
      <Dock />
    </div>
  );
}
