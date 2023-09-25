import React from "react";
import { getSession } from "@auth0/nextjs-auth0/edge";
import Usage from "@/app/usage/Usage";

export const runtime = "edge";

export default async function SSRPage() {
  const session = await getSession();
  return (
    <div
      className={
        "px-4 md:px-10 pt-4 absolute h-[calc(100vh-60px)] w-full overflow-y-auto pb-20 space-y-20"
      }
    >
      <Usage />
    </div>
  );
}
