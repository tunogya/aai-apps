import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
import Chat from "@/app/chat/Chat";

export const runtime = "edge";

export default withPageAuthRequired(
  async function SSRPage() {
    const session = await getSession();
    return <Chat />;
  },
  { returnTo: "/dashboard" },
);
