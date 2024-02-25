import React from "react";
import Link from "next/link";

export const runtime = "edge";

export default async function SSRPage() {
  return (
    <div
      className={
        "h-full w-full items-center justify-center space-y-4 select-none relative flex flex-col"
      }
    >
      <div className={"text-[120px]"}>🎉</div>
      <div className="text-center text-2xl md:text-3xl font-serif text-white">
        &quot;All Done!&quot;
      </div>
      <Link
        href={"/"}
        prefetch
        className={
          "w-64 py-4 border rounded-full text-center bg-green-500 text-white font-bold mt-4"
        }
      >
        Got it
      </Link>
    </div>
  );
}
