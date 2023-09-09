import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
import NovelEditor from "@/components/NovelEditor";

export const runtime = "edge";

export default withPageAuthRequired(
  async function SSRPage() {
    const session = await getSession();
    return (
      <div className={"h-[calc(100vh-60px)] min-w-[400px]"}>
        <NovelEditor />
      </div>
    );
  },
  { returnTo: "/dashboard" },
);
