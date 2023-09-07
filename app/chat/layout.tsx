import { Metadata } from "next";
import { ReactNode } from "react";
import Link from "next/link";
import CoreNav from "@/components/nav/CoreNav";
import RecentNav from "@/components/nav/RecentNav";

export const runtime = "edge";

const title = "Chat - AbandonAI";
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
          <div className={"ml-6"}>account</div>
          <CoreNav active={"/chat"} />
          <RecentNav />
        </div>
        <div className={"w-full px-8 py-4 mr-10"}>{props.children}</div>
      </div>
      <div
        className={
          "absolute right-0 top-0 h-full w-10 border-l flex flex-col items-center justify-center space-y-6"
        }
      >
        <div className={"h-6 w-6 bg-red-500 rounded"}>1</div>
        <div className={"h-6 w-6 bg-red-500 rounded"}>2</div>
      </div>
    </div>
  );
}
