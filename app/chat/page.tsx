import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";

export const runtime = "edge";

export default withPageAuthRequired(
  async function SSRPage() {
    const session = await getSession();
    return <div>dashboard</div>;
  },
  { returnTo: "/dashboard" },
);
