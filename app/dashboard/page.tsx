import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
import Image from "next/image";

export const runtime = "edge";

export default withPageAuthRequired(
  async function SSRPage() {
    const session = await getSession();
    return (
      <div
        className={
          "px-10 pt-4 absolute h-[calc(100vh-60px)] w-full overflow-y-auto pb-40 space-y-10"
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
          <div className={"flex gap-8 h-40"}>
            <div className={"w-full max-w-3xl h-full text-sm text-stone-800"}>
              <div className={"flex"}>
                <div className={"w-64 space-y-1"}>
                  <div>Cost & usage</div>
                  <div className={"text-stone-800 text-xl"}>US$0</div>
                </div>
                <div className={"w-64 space-y-1"}>
                  <div>Yesterday</div>
                  <div className={"text-stone-400 text-md"}>US$0</div>
                </div>
              </div>
              <div></div>
            </div>
            <div className={"flex-1 h-full text-sm text-stone-800"}>
              <div className={"h-[50%]"}>
                <div className={"space-y-1"}>
                  <div>Estimate cost this month</div>
                  <div className={"text-stone-800 text-xl"}>US$0</div>
                </div>
              </div>
              <div className={"h-[50%]"}>
                <div className={"space-y-1"}>
                  <div>Advance pay balance</div>
                  <div className={"text-stone-800 text-xl"}>US$0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={"space-y-8"}>
          <div
            className={
              "text-2xl font-semibold text-stone-800 border-b w-full py-2"
            }
          >
            Your overview
          </div>
        </div>
      </div>
    );
  },
  { returnTo: "/dashboard" },
);
