import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const ApiKey = dynamic(() => import("@/app/developers/ApiKey"));

export const runtime = "edge";

export default async function SSRPage() {
  return (
    <div
      className={
        "px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full overflow-y-auto space-y-20"
      }
    >
      <div className={"text-gray-800 flex flex-col gap-4 pb-4"}>
        <div className={"text-3xl font-semibold border-b py-2"}>API Key</div>
        <div className={"text-sm text-gray-500 max-w-[760px]"}>
          Do not share your API key with others, or expose it in the browser or
          other client-side code. In order to protect the security of your
          account, AbandonAI may also automatically disable any API key that we
          have found has leaked publicly.{" "}
          <Link
            href={"https://www.abandon.ai/docs/resource/GetStarted/apikey"}
            target={"_blank"}
            className={"underline text-[#0066FF]"}
          >
            Learn more about API Key.
          </Link>
        </div>
        <ApiKey />
      </div>
    </div>
  );
}
