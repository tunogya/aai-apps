import React from "react";
import { getSession } from "@auth0/nextjs-auth0/edge";
import Pages from "@/app/billing/Pages";

export const runtime = "edge";

export default async function SSRPage() {
  const session = await getSession();
  return (
    <div className={"absolute h-[calc(100vh-48px)] w-full"}>
      <Pages />
    </div>
  );
}
