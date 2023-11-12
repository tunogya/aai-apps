import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="w-full h-full space-y-20 justify-center items-center py-4 px-3">
      <div className="text-center text-2xl md:text-3xl font-serif">Oops!</div>
      <Link
        href={"/auth/login"}
        prefetch
        className="flex w-full items-center justify-center gap-2"
      >
        Back
      </Link>
    </div>
  );
}
