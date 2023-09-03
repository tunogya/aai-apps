import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
export default withPageAuthRequired(
  async function SSRPage() {
    const session = getSession();
    return (
      <div className={"flex flex-col gap-2 h-full w-full"}>
        <div className={"text-xl font-bold"}>Dashboard</div>
        <div>dashboard</div>
      </div>
    );
  },
  { returnTo: "/dashboard" },
);
