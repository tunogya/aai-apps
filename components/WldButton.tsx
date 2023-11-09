import Image from "next/image";
import React from "react";

const WldButton = () => {
  return (
    <button
      disabled
      className={
        "flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      <Image
        alt={""}
        src={"/worldcoin-logos.svg"}
        width={20}
        height={20}
        fetchPriority={"low"}
      />
      Buy with Worldcoin
    </button>
  );
};
export default WldButton;
