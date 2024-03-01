import Link from "next/link";
import { OpenAI } from "@lobehub/icons";
import React from "react";

const AbandonAI = () => {
  return (
    <Link
      href={"https://chat.abandon.ai"}
      target={"_blank"}
      className={"w-full md:w-fit"}
    >
      <div
        className={
          "flex flex-row items-center md:flex-col bg-[#181818] p-4 rounded-lg gap-4 md:gap-2 overflow-hidden ring-white hover:ring group"
        }
      >
        <div
          className={
            "w-28 h-28 md:w-52 md:h-52 bg-[#40b840] p-1 md:p-3 cursor-pointer rounded-lg relative overflow-hidden"
          }
        >
          <div className={"text-md md:text-2xl font-semibold text-white"}>
            ChatGPT
          </div>
          <div
            className={
              "absolute right-[-20px] bottom-[-20px] md:right-[-24px] md:bottom-[-24px] p-1 md:p-2 rotate-45 shadow-xl shadow-black/30 w-20 h-20 md:w-28 md:h-28"
            }
            style={{
              backgroundImage:
                "url(https://nftstorage.link/ipfs/bafkreialozci4nzjme7a4jjjfwelogn42klvuwiy7sdjeyyivsejuuu3fm)",
              backgroundSize: "cover",
            }}
          >
            <OpenAI className={"md:w-10 md:h-10 w-8 h-8"} color={"#121212"} />
          </div>
        </div>
        <div className={"flex flex-col flex-1 md:w-52 gap-2"}>
          <div className={"text-white font-semibold"}>chat.abandon.ai</div>
          <div className={"text-[#a7a7a7] text-sm"}>
            {`Simple, use OpenAI ChatGPT & Google Gemini. Pay as you go.`}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AbandonAI;
