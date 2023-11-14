import React from "react";
import Link from "next/link";

export const runtime = "edge";

export default function Page() {
  return (
    <div className="w-full h-full space-y-20 justify-center items-center py-4 gap-20 px-3 flex flex-col">
      <div className="text-center text-2xl md:text-3xl font-serif">
        &quot;Verify your email, please!&quot;
      </div>
      <Link
        href={"/dashboard"}
        prefetch
        className="flex px-3 py-3 w-full sm:w-[240px] text-white rounded items-center justify-center gap-2 bg-gray-950 hover:bg-gray-900 font-medium"
      >
        Continue
      </Link>
    </div>
  );
}
