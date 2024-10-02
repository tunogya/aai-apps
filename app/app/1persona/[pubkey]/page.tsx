"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const [input, setInput] = useState<string>("");
  const [chat, setChat] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const { pubkey } = useParams();

  const sendMessage = async () => {};

  return (
    <div
      className={
        "flex flex-col w-full h-full items-center justify-center text-white"
      }
    >
      <div
        className={
          "max-w-xl w-full h-full items-center justify-center p-4 overflow-y-scroll"
        }
      >
        <div className={"text-[#B3B3B3] text-[14px] text-center p-4"}>
          Talk with Tom, powered by AI.
        </div>
        <UserChat />
        <AssistantChat />
      </div>
      <div className={"max-w-xl w-full flex items-center justify-center"}>
        <div
          className={
            "w-full flex items-center justify-center bg-[#3B3B3B] rounded-[18px] mx-4 my-4"
          }
        >
          <input
            value={input}
            placeholder={"Ask me anything..."}
            className={
              "bg-transparent outline-none flex-1 px-3 py-1.5 text-[16px] leading-[24px]"
            }
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className={
              "py-1.5 rounded-full text-black mx-1 bg-green-500 h-7 w-7 flex items-center justify-center"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              className="size-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;

const UserChat = () => {
  return (
    <div className={"flex flex-col justify-center items-end py-1"}>
      <div
        className={
          "bg-[#3B3B3B] px-4 py-1.5 rounded-[18px] text-[16px] leading-[24px]"
        }
      >
        User
      </div>
    </div>
  );
};

const AssistantChat = () => {
  return (
    <div className={"py-1 flex flex-col justify-center items-start"}>
      <div className={"font-medium text-[16px] leading-[24px]"}>Assistant</div>
    </div>
  );
};
