import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
import Form from "@/app/new/Form";

export default withPageAuthRequired(
  async function SSRPage() {
    return (
      <div className={"flex flex-col gap-2 h-full w-full items-center"}>
        <div className={"max-w-3xl w-full"}>
          <div className={"pb-2 border-b"}>
            <div className={"text-2xl font-semibold text-gray-800 pt-2"}>
              Create a new persona
            </div>
            <div className={"text-sm text-gray-500"}>
              How to create persona?
            </div>
          </div>
          <div className={"py-2 text-xs italic text-gray-500"}>
            Required fields are marked with an asterisk (*).
          </div>
          <Form />
        </div>
      </div>
    );
  },
  { returnTo: "/new" },
);
