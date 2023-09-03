import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
import { AddDialog } from "@/app/persona/AddDialog";
import Link from "next/link";
import { SearchDialog } from "@/app/persona/SearchDialog";
export default withPageAuthRequired(
  async function SSRPage() {
    // @ts-ignore
    const { user } = await getSession();
    // @ts-ignore
    return (
      <div className={"flex flex-col gap-2 h-full w-full relative"}>
        <div className={"flex pb-3 border-b items-center justify-between"}>
          <div className={"text-xl font-semibold text-gray-800 py-2"}>
            Persona
          </div>
          <div className={"flex space-x-3 text-sm py-2"}>
            <Link
              href={"/persona?dialog=search"}
              className={
                "px-3 h-8 border rounded flex items-center justify-center cursor-pointer hover:bg-gray-100"
              }
            >
              Search
            </Link>
            <Link
              href={"/persona?dialog=add"}
              className={
                "px-3 h-8 border rounded bg-blue-600 text-white flex items-center justify-center cursor-pointer hover:bg-blue-500"
              }
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </Link>
          </div>
        </div>
        <div
          className={
            "h-full w-full flex flex-col items-center justify-center gap-3"
          }
        >
          <div className={"font-medium"}>Welcome to Persona</div>
          <div className={"max-w-xs text-sm font-light text-center"}>
            Creating your first persona mask is an exciting journey of
            self-discovery and empowerment.
            <br />
            <Link
              href={"/persona?dialog=add"}
              className={"underline font-medium text-blue-500"}
            >
              Create my 1st persona
            </Link>
          </div>
        </div>
        <div>{JSON.stringify(user)}</div>
        <AddDialog />
        <SearchDialog />
      </div>
    );
  },
  { returnTo: "/persona" },
);
