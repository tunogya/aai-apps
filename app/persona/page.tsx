import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
export default withPageAuthRequired(
  async function SSRPage() {
    const session = getSession();
    return (
      <div className={"flex flex-col gap-2 h-full w-full"}>
        <div className={"pb-3 border-b"}>
          <div className={"text-xl font-bold text-gray-800 py-2"}>Persona</div>
          <div></div>
        </div>
      </div>
    );
  },
  { returnTo: "/dashboard" },
);
