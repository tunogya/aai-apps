import Link from "next/link";
import { OpenAI } from "@lobehub/icons";
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
            "w-28 h-28 md:w-52 md:h-52 bg-pink-600 p-1 md:p-3 cursor-pointer rounded-lg relative overflow-hidden"
          }
        >
          <div className={"text-md md:text-2xl font-semibold text-white"}>
            AAI Coin
          </div>
          <div
            className={"absolute right-0 bottom-0 group-hover:animate-pulse"}
          >
            <svg
              width="120"
              height="120"
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M68 68V956H956V68H68ZM142 882V142H586V413.333L512 216H438L216 808H290L345.5 660H586V882H142ZM576.791 586H373.209L475 314.667L576.791 586Z"
                fill="white"
              />
            </svg>
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
