import React from "react";
import { getSession } from "@auth0/nextjs-auth0/edge";
import Today from "@/app/dashboard/Today";
import Overview from "@/app/dashboard/Overview";

export const runtime = "edge";

export default async function SSRPage() {
  const session = await getSession();
  return (
    <div
      className={
        "px-4 md:px-10 pt-4 absolute h-[calc(100vh-60px)] w-full overflow-y-auto pb-40 space-y-20"
      }
    >
      <div className={"space-y-8"}>
        <div
          className={
            "text-2xl font-semibold text-stone-800 border-b w-full py-2"
          }
        >
          Today
        </div>
        <Today />
      </div>
      {/*<div className={"space-y-8"}>*/}
      {/*  <div*/}
      {/*    className={*/}
      {/*      "text-2xl font-semibold text-stone-800 border-b w-full py-2"*/}
      {/*    }*/}
      {/*  >*/}
      {/*    Your overview*/}
      {/*  </div>*/}
      {/*  <Overview />*/}
      {/*</div>*/}
    </div>
  );
}
