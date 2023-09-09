import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";

export const runtime = "edge";

export default withPageAuthRequired(
  async function SSRPage() {
    const session = await getSession();
    return (
      <div className={"w-full min-w-[400px]"}>
        <div
          className={
            "absolute h-[calc(100vh-60px)] w-full overflow-y-auto pb-40"
          }
        >
          <div
            className={
              "flex border-t px-8 py-4 bg-stone-100 items-center justify-center"
            }
          >
            <div className={"max-w-3xl w-full "}>Chat list</div>
          </div>
        </div>
        <div
          className={
            "absolute bottom-0 pb-8 left-0 w-full px-8 xl:px-20 flex justify-center bg-gradient-to-b from-white/10 to-white"
          }
        >
          <input
            className={
              "border rounded w-full p-4 shadow focus:outline-0 max-w-3xl text-stone-800"
            }
            placeholder={"Send a message..."}
          />
        </div>
      </div>
    );
  },
  { returnTo: "/dashboard" },
);
