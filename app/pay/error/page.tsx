"use client";
import Link from "next/link";
import { TopUpButton } from "@/app/components/TopUpButton";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function CSRPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Something went wrong";

  return (
    <div
      className={
        "h-full w-full space-y-4 items-center justify-center select-none relative"
      }
    >
      <div className={"text-[120px]"}>😫</div>
      <div className="text-center text-2xl md:text-3xl font-serif">
        &quot;{error}&quot;
      </div>
      <Link
        href={"/"}
        prefetch
        className={"text-gray-500 hover:text-gray-800 text-sm underline"}
      >
        Back
      </Link>
    </div>
  );
}
