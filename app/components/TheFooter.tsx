import Link from "next/link";
import React from "react";

const TheFooter = () => {
  return (
    <div className={"absolute bottom-8 text-center text-white text-xs"}>
      <Link href={"https://www.abandon.ai"}>
        © {new Date().getFullYear()} Abandon Inc., All rights reserved.
      </Link>
      <div>
        8 The Green, STE R Dover DE 19901 USA.{" "}
        <Link
          href={"mailto:tom@abandon.ai"}
          className={"text-green-500 underline"}
        >
          tom@abandon.ai
        </Link>
      </div>
    </div>
  );
};

export default TheFooter;
