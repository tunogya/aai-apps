"use client";
import Link from "next/link";
import { DepositButton } from "@/components/DepositButton";
import React from "react";
import { useSearchParams } from "next/navigation";

export default async function SSRPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Something went wrong";

  return (
    <div
      className={
        "h-full w-full flex flex-col items-center justify-center gap-4 select-none relative"
      }
    >
      <div className={"text-[120px]"}>😫</div>
      <div className="text-center text-2xl md:text-3xl font-serif">
        &quot;{error}&quot;
      </div>
      <DepositButton
        className={
          "w-64 py-4 border rounded-full text-center bg-yellow-500 text-white font-bold mt-4"
        }
      />
      <Link
        href={"/dashboard"}
        prefetch
        className={"text-gray-500 hover:text-black text-sm underline"}
      >
        Back
      </Link>
    </div>
  );
}
