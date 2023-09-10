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
          "px-8 pt-4 absolute h-[calc(100vh-60px)] w-full overflow-y-auto pb-40 grid grid-cols-2 gap-8"
        }
      >
        <div className={"space-y-2"}>
          <div className={"flex items-center space-x-2"}>
            <div
              className={
                "h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow"
              }
            >
              <Image
                src={`https://www.gravatar.com/avatar/1?s=200&d=retro`}
                width={32}
                height={32}
                alt={""}
              />
            </div>
            <div className={"text-xl font-semibold text-stone-800"}>Tom</div>
          </div>
          <div className={"w-full h-40 border rounded"}></div>
        </div>
      </div>
    );
  },
  { returnTo: "/dashboard" },
);
