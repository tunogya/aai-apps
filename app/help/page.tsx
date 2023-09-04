import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
export default withPageAuthRequired(
  async function SSRPage() {
    const session = await getSession();
    return (
      <div className={"flex flex-col gap-2 h-full w-full"}>
        <div className={"flex pb-3 border-b items-center justify-between"}>
          <div className={"text-xl font-semibold text-gray-500 py-2"}>
            Help & Support
          </div>
          <div className={"flex space-x-3 text-sm py-2"}>
            <button className={"px-3 h-8 border rounded"}>Search</button>
          </div>
        </div>
      </div>
    );
  },
  { returnTo: "/help" },
);
