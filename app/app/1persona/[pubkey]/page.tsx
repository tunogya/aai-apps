"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { decodeKey } from "@/utils/nostrUtils";
import { generateSecretKey, getPublicKey } from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

const Page = () => {
  const [input, setInput] = useState<string>("");
  const [events, setEvents] = useState<any[]>([]);
  const { pubkey } = useParams();
  const [pk, setPk] = useState<string>("");
  const decodedPubkey = decodeKey(pubkey as string);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [profile, setProfile] = useState<any>(null);

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
      // 请求聊天对象的 profile
      requestProfile();
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
          if (_e.kind === 14 && _e.sig === decodedPubkey) {
            saveEventToSessionStorage(_e);
            loadChatFromSessionStorage();
          } else if (_e.kind === 0 && _e.pubkey === decodedPubkey) {
            // 处理接收到的 profile 数据
            setProfile(JSON.parse(_e.content));
          }
        } catch (e) {
          console.log(e);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pk, decodedPubkey]);

  const requestProfile = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const subscriptionId = uuidv4();
      const request = JSON.stringify([
        "REQ",
        subscriptionId,
        {
          kinds: [0],
          authors: [decodedPubkey],
          limit: 1,
        },
      ]);
      ws.current.send(request);
    }
  }, [decodedPubkey]);

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
        ["history", ...events.map((e) => e.content)],
      ] as string[][],
      created_at: Math.floor(Date.now() / 1000),
      sig: decodedPubkey,
    };
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
      (event: any) => event.sig === decodedPubkey && event.kind === 14,
    );
    setEvents(events);
  };

  useEffect(() => {
    const _skHex = localStorage.getItem("skHex");
    if (_skHex) {
      setPk(getPublicKey(hexToBytes(_skHex)));
    } else {
      let sk = generateSecretKey();
      setPk(getPublicKey(sk));
      const skHex = bytesToHex(sk);
      localStorage.setItem("skHex", skHex);
    }
  }, []);

  const clearChat = () => {
    sessionStorage.removeItem("events");
    setEvents([]);
  };

  return (
    <div
      className={
        "flex flex-col w-full h-full items-center justify-center text-white relative"
      }
    >
      <div
        className={
          "max-w-xl w-full h-full items-center justify-center overflow-y-scroll pb-60"
        }
      >
        <div className={"p-3 sticky top-0 flex items-center justify-between"}>
          <div
            className={"flex items-center justify-start space-x-3 bg-[#121212]"}
          >
            {profile?.picture ? (
              <div className={"w-7 h-7 rounded-full overflow-hidden"}>
                <Image
                  width={28}
                  height={28}
                  src={profile?.picture}
                  alt={profile?.name || "Profile"}
                  className={"w-7 h-7 object-cover"}
                />
              </div>
            ) : (
              <div className={"w-7 h-7 rounded-full overflow-hidden"}>
                <div className={"w-7 h-7 bg-[#3B3B3B] rounded-full"}></div>
              </div>
            )}
            <div className={"flex flex-col"}>
              <div className={"text-[14px] font-medium text-white"}>
                {profile?.name || "Anonymous"}
              </div>
              {profile?.about && (
                <div className={"text-[12px] leading-[18px] text-[#B3B3B3]"}>
                  {profile.about}
                </div>
              )}
            </div>
          </div>
          <button
            className={`text-[12px] leading-[18px] text-red-500 text-center ${
              events.length > 0 ? "opacity-100" : "opacity-50"
            }`}
            disabled={events.length === 0}
            onClick={clearChat}
          >
            清空
          </button>
        </div>
        <div
          className={
            "text-[12px] leading-[18px] text-[#B3B3B3] text-center pt-20 pb-4 px-3"
          }
        >
          Talk with {profile?.name || "Anonymous"}, powered by AI.
        </div>
        <div className={"px-3"}>
          {events.map((event, index) => {
            if (event.pubkey === pk) {
              return <UserChat content={event.content} key={index} />;
            } else {
              return <AssistantChat content={event.content} key={index} />;
            }
          })}
        </div>

        {events.length > 0 && events[events.length - 1].pubkey === pk && (
          <div className="flex justify-start items-center my-2 px-3">
            <div className="animate-spin h-5 w-5 bg-white"></div>
          </div>
        )}
      </div>
      <div
        className={
          "max-w-xl w-full flex flex-col items-center justify-center absolute bottom-0 bg-[#121212] px-3 pb-safe"
        }
      >
        <div
          className={
            "w-full flex items-center justify-center bg-[#3B3B3B] rounded-[18px] mx-3 my-1.5"
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
        <div className={"text-[#B3B3B3] text-[10px] text-center pb-2"}>
          Copyright © {new Date().getFullYear()} Abandon Inc. All rights
          reserved.
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
