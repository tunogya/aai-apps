import React from "react";
import { getSession } from "@auth0/nextjs-auth0/edge";
import Link from "next/link";
import { TypedInfo } from "@/app/pay/success/TypedInfo";

export const runtime = "edge";

export default async function SSRPage() {
  const session = await getSession();
  return (
    <div
      className={
        "h-full w-full flex flex-col items-center justify-center gap-4 select-none relative"
      }
    >
      <div className={"text-[120px]"}>🎉</div>
      <div className={"text-4xl font-bold text-green-500"}>ALL DONE</div>
      <TypedInfo />
      <Link
        href={"/dashboard"}
        className={
          "w-64 py-4 border rounded-full text-center bg-green-500 text-white font-bold mt-4"
        }
      >
        Got it
      </Link>
    </div>
  );
}
