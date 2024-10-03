"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { decodeKey } from "@/utils/nostrUtils";
import { generateSecretKey, finalizeEvent, verifyEvent } from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { getPublicKey } from "nostr-tools";

const Page = () => {
  const [input, setInput] = useState<string>("");
  const [chat, setChat] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const { pubkey } = useParams();
  const [sk, setSk] = useState<Uint8Array>();
  const [pk, setPk] = useState<string>("");
  const decodedPubkey = decodeKey(pubkey as string);

  // ws://relay.abandon.ai/

  const sendMessage = async () => {
    setChat([...chat, { role: "user", content: input }]);
    setInput("");
  };

  useEffect(() => {
    const _skHex = localStorage.getItem("skHex");
    if (_skHex) {
      setSk(hexToBytes(_skHex));
      setPk(getPublicKey(hexToBytes(_skHex)));
    } else {
      let sk = generateSecretKey();
      setSk(sk);
      setPk(getPublicKey(sk));
      const skHex = bytesToHex(sk);
      localStorage.setItem("skHex", skHex);
    }
  }, []);

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
        {chat.map((chat, index) => {
          if (chat.role === "user") {
            return <UserChat content={chat.content} key={index} />;
          } else {
            return <AssistantChat content={chat.content} key={index} />;
          }
        })}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
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
              strokeWidth="2"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
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

const UserChat = ({ content }: { content: string }) => {
  return (
    <div className={"flex flex-col justify-center items-end py-1"}>
      <div
        className={
          "bg-[#3B3B3B] px-4 py-1.5 rounded-[18px] text-[16px] leading-[24px]"
        }
      >
        {content}
      </div>
    </div>
  );
};

const AssistantChat = ({ content }: { content: string }) => {
  return (
    <div className={"py-1 flex flex-col justify-center items-start"}>
      <div className={"font-medium text-[16px] leading-[24px]"}>{content}</div>
    </div>
  );
};
