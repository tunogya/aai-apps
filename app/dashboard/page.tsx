import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";

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
          <div className={"text-xl font-semibold text-stone-800"}>Tom</div>
          <div className={"w-full h-40 border"}></div>
        </div>
      </div>
    );
  },
  { returnTo: "/dashboard" },
);
