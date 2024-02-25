"use client";
import Link from "next/link";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function CSRPage({ params }: any) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Something went wrong";

  return (
    <div
      className={
        "h-full w-full space-y-4 items-center justify-center select-none relative flex flex-col"
      }
    >
      <div className={"text-[120px]"}>😫</div>
      <div className="text-center text-2xl md:text-3xl font-serif text-white">
        &quot;{error}&quot;
      </div>
      <Link href={"/"} prefetch className={"text-white text-sm underline"}>
        Back
      </Link>
    </div>
  );
}
