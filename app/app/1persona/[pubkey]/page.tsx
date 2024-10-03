"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { decodeKey } from "@/utils/nostrUtils";
import { generateSecretKey, finalizeEvent, verifyEvent } from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { getPublicKey } from "nostr-tools";
import { v4 as uuidv4 } from "uuid";

const Page = () => {
  const [input, setInput] = useState<string>("");
  const [chat, setChat] = useState<any[]>([]);
  const { pubkey } = useParams();
  const [sk, setSk] = useState<Uint8Array>();
  const [pk, setPk] = useState<string>("");
  const decodedPubkey = decodeKey(pubkey as string);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const url = `wss://relay.abandon.ai?pubkey=${pk}`;
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WebSocket connection opened.");
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      reconnectWithBackoff();
    };

    ws.current.onerror = (e) => {
      console.log(`WebSocket error: ${e}, attempting to reconnect...`);
      reconnectWithBackoff();
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data?.[0] === "EVENT") {
        const _e = data[2];
        try {
          console.log(_e);
          saveEventToSessionStorage(_e);
          loadChatFromSessionStorage();
        } catch (e) {
          console.log(e);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pk]);

  const reconnectWithBackoff = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    reconnectTimeoutRef.current = setTimeout(() => {
      connectWebSocket();
    }, 5000);
  }, [connectWebSocket]);

  const send = useCallback(
    (message: string) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(message);
      } else {
        console.log("WebSocket connection not open");
      }
    },
    [ws],
  );

  useEffect(() => {
    if (pk) {
      connectWebSocket();
      loadChatFromSessionStorage();
    }
    return () => ws.current?.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pk]);

  const sendMessage = async () => {
    const event = {
      id: uuidv4(),
      kind: 14,
      content: input,
      pubkey: pk,
      tags: [
        ["p", pubkey],
        ["role", "user"],
      ] as string[][],
      created_at: Math.floor(Date.now() / 1000),
      sig: decodedPubkey,
    };
    console.log(event);
    await saveEventToSessionStorage(event);
    setInput("");
    send(JSON.stringify(["EVENT", event]));
    loadChatFromSessionStorage();
  };

  const saveEventToSessionStorage = (event: {
    id: string;
    kind: number;
    content: string;
    pubkey: string;
    tags: string[][];
    created_at: number;
    sig: string;
  }) => {
    const events = JSON.parse(sessionStorage.getItem("events") || "[]");
    events.push(event);
    sessionStorage.setItem("events", JSON.stringify(events));
  };

  const loadChatFromSessionStorage = () => {
    const events = JSON.parse(sessionStorage.getItem("events") || "[]").filter(
      (event) => event.sig === decodedPubkey && event.kind === 14,
    );
    setChat(events);
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
        "flex flex-col w-full h-full items-center justify-center text-white relative"
      }
    >
      <div
        className={
          "max-w-xl w-full h-full items-center justify-center p-3 overflow-y-scroll"
        }
      >
        <div className={"text-[#B3B3B3] text-[14px] text-center pb-3"}>
          Talk with Tom, powered by AI.
        </div>
        {chat.map((event, index) => {
          if (event.pubkey === pk) {
            return <UserChat content={event.content} key={index} />;
          } else {
            return <AssistantChat content={event.content} key={index} />;
          }
        })}
      </div>
      <div
        className={
          "max-w-xl w-full flex items-center justify-center absolute bottom-0"
        }
      >
        <div
          className={
            "w-full flex items-center justify-center bg-[#3B3B3B] rounded-[18px] mx-3 my-2"
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
