import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";

export const runtime = "edge";

export default withPageAuthRequired(
  async function SSRPage() {
    const session = await getSession();
    return (
      <div className={"w-full flex-1 min-w-[400px]"}>
        <div className={"absolute h-[calc(100vh-60px)] w-full overflow-y-auto"}>
          <div
            className={
              "flex border-t px-8 py-4 bg-gray-100 items-center justify-center"
            }
          >
            <div className={"max-w-3xl w-full bg-red-500"}>Chat list</div>
          </div>
          <div
            className={"flex border-t px-8 py-4 items-center justify-center"}
          >
            <div className={"max-w-3xl w-full"}>Chat list</div>
          </div>
          <div
            className={
              "flex border-t px-8 py-4 bg-gray-100 items-center justify-center"
            }
          >
            <div className={"max-w-3xl w-full bg-red-500"}>Chat list</div>
          </div>
          <div
            className={"flex border-t px-8 py-4 items-center justify-center"}
          >
            <div className={"max-w-3xl w-full"}>Chat list</div>
          </div>
          <div
            className={
              "flex border-t px-8 py-4 bg-gray-100 items-center justify-center"
            }
          >
            <div className={"max-w-3xl w-full bg-red-500"}>Chat list</div>
          </div>
          <div
            className={"flex border-t px-8 py-4 items-center justify-center"}
          >
            <div className={"max-w-3xl w-full"}>Chat list</div>
          </div>
          <div
            className={
              "flex border-t px-8 py-4 bg-gray-100 items-center justify-center"
            }
          >
            <div className={"max-w-3xl w-full bg-red-500"}>Chat list</div>
          </div>
          <div
            className={"flex border-t px-8 py-4 items-center justify-center"}
          >
            <div className={"max-w-3xl w-full"}>Chat list</div>
          </div>
          <div
            className={
              "flex border-t px-8 py-4 bg-gray-100 items-center justify-center"
            }
          >
            <div className={"max-w-3xl w-full bg-red-500"}>Chat list</div>
          </div>
          <div
            className={"flex border-t px-8 py-4 items-center justify-center"}
          >
            <div className={"max-w-3xl w-full"}>Chat list</div>
          </div>
          <div
            className={
              "flex border-t px-8 py-4 bg-gray-100 items-center justify-center"
            }
          >
            <div className={"max-w-3xl w-full bg-red-500"}>Chat list</div>
          </div>
          <div
            className={"flex border-t px-8 py-4 items-center justify-center"}
          >
            <div className={"max-w-3xl w-full"}>Chat list</div>
          </div>
          <div
            className={
              "flex border-t px-8 py-4 bg-gray-100 items-center justify-center"
            }
          >
            <div className={"max-w-3xl w-full bg-red-500"}>Chat list</div>
          </div>
          <div
            className={"flex border-t px-8 py-4 items-center justify-center"}
          >
            <div className={"max-w-3xl w-full"}>Chat list</div>
          </div>
          <div
            className={
              "flex border-t px-8 py-4 bg-gray-100 items-center justify-center"
            }
          >
            <div className={"max-w-3xl w-full bg-red-500"}>Chat list</div>
          </div>
          <div
            className={"flex border-t px-8 py-4 items-center justify-center"}
          >
            <div className={"max-w-3xl w-full"}>Chat list</div>
          </div>
          <div
            className={
              "flex border-t px-8 py-4 bg-gray-100 items-center justify-center"
            }
          >
            <div className={"max-w-3xl w-full bg-red-500"}>Chat list</div>
          </div>
          <div
            className={"flex border-t px-8 py-4 items-center justify-center"}
          >
            <div className={"max-w-3xl w-full"}>Chat list</div>
          </div>
          <div
            className={
              "flex border-t px-8 py-4 bg-gray-100 items-center justify-center"
            }
          >
            <div className={"max-w-3xl w-full bg-red-500"}>Chat list</div>
          </div>
          <div
            className={"flex border-t px-8 py-4 items-center justify-center"}
          >
            <div className={"max-w-3xl w-full"}>Chat list</div>
          </div>
        </div>
        <div
          className={
            "absolute bottom-8 left-0 w-full px-8 xl:px-20 flex justify-center"
          }
        >
          <input
            className={
              "border rounded w-full p-4 shadow focus:outline-0 max-w-3xl"
            }
            placeholder={"Send a message..."}
          />
        </div>
      </div>
    );
  },
  { returnTo: "/dashboard" },
);
