import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";

export const runtime = "edge";

export default withPageAuthRequired(
  async function SSRPage() {
    const session = await getSession();
    return (
      <div className={"w-full px-8 min-w-[400px]"}>
        <div>Chat list</div>
      </div>
    );
  },
  { returnTo: "/dashboard" },
);
