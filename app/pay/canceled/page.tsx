import React from "react";
import { getSession } from "@auth0/nextjs-auth0/edge";
import Link from "next/link";
import { TypedInfo } from "@/app/pay/canceled/TypedInfo";

export const runtime = "edge";

export default async function SSRPage() {
  const session = await getSession();
  return (
    <div
      className={
        "h-full w-full flex flex-col items-center justify-center gap-4 select-none"
      }
    >
      <div className={"text-[120px]"}>😫</div>
      <div className={"text-3xl font-bold text-yellow-500"}>CANCELED</div>
      <TypedInfo />
      <Link
        href={"/dashboard"}
        className={
          "w-64 py-4 border rounded-full text-center bg-yellow-500 text-white font-bold mt-4"
        }
      >
        Back
      </Link>
      <button className={"text-stone-500 hover:text-stone-800 text-sm"}>
        Deposit again
      </button>
    </div>
  );
}
