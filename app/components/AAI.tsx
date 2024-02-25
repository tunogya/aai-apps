import Link from "next/link";
import React from "react";

const AAI = () => {
  return (
    <Link href={"/wallet"} prefetch>
      <div
        className={
          "flex flex-row items-center md:flex-col bg-[#181818] p-4 rounded-lg gap-4 md:gap-2 overflow-hidden ring-white hover:ring group"
        }
      >
        <div
          className={
            "w-28 h-28 md:w-52 md:h-52 bg-[#d3373c] p-1 md:p-3 cursor-pointer rounded-lg relative overflow-hidden"
          }
        >
          <div className={"text-md md:text-2xl font-semibold text-white"}>
            AAI Coin
          </div>
          <div
            className={
              "absolute right-[-20px] bottom-[-20px] md:right-[-24px] md:bottom-[-24px] p-1 md:p-2 rotate-45 shadow-xl shadow-black/30 w-20 h-20 md:w-28 md:h-28"
            }
            style={{
              backgroundImage:
                "url(https://nftstorage.link/ipfs/bafkreie2yh7h2k2lvkqjepk2cck5gszwwwopb4pvhbsmalyhbkmgnm7kye)",
              backgroundSize: "cover",
            }}
          >
            <div className={"md:w-10 md:h-10 h-8 w-8"}>
              <svg
                viewBox="0 0 1024 1024"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M68 68V956H956V68H68ZM142 882V142H586V413.333L512 216H438L216 808H290L345.5 660H586V882H142ZM576.791 586H373.209L475 314.667L576.791 586Z"
                  fill="#121212"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className={"flex flex-col flex-1 md:w-52 gap-2"}>
          <div className={"text-white font-semibold"}>1 AAI = 1 USD</div>
          <div className={"text-[#a7a7a7] text-sm"}>
            Deposit, withdraw, and trade AAI Coins on AbandonAI.
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AAI;
