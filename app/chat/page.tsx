import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
export default withPageAuthRequired(
  async function SSRPage() {
    const session = await getSession();
    return <div>chat</div>;
  },
  { returnTo: "/chat" },
);
