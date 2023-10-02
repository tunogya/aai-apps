import React from "react";
import { getSession } from "@auth0/nextjs-auth0/edge";
import Pages from "@/app/usage/Pages";

export const runtime = "edge";

export default async function SSRPage() {
  const session = await getSession();
  return (
    <div
      className={
        "md:px-10 pt-2 md:pt-4 absolute h-[calc(100vh-60px)] w-full overflow-y-auto pb-20 space-y-20"
      }
    >
      <Pages />
    </div>
  );
}
