import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center py-4 gap-20 px-3">
      <div className="text-center text-2xl md:text-3xl font-serif">
        &quot;Verify your email, please!&quot;
      </div>
      <Link
        href={"/dashboard"}
        className="flex px-3 py-3 w-full sm:w-[240px] text-white rounded items-center justify-center gap-2 bg-gray-950 hover:bg-gray-900 font-medium"
      >
        Continue
      </Link>
    </div>
  );
}
