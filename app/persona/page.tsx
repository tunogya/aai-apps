import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
import Link from "next/link";
import ListPersona from "@/app/persona/ListPersona";

export default withPageAuthRequired(
  async function SSRPage() {
    return (
      <div className={"flex flex-col gap-2 h-full w-full"}>
        <div className={"flex pb-3 border-b items-center justify-between"}>
          <div className={"text-xl font-semibold text-gray-800 py-2"}>
            Persona
          </div>
          <div className={"flex space-x-3 text-sm py-2"}>
            <Link
              href={"/new"}
              className={
                "px-3 h-8 border rounded bg-gray-600 text-white flex items-center justify-center cursor-pointer hover:bg-gray-500"
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
        <div className={"max-w-3xl"}>
          <ListPersona />
        </div>
      </div>
    );
  },
  { returnTo: "/persona" },
);
