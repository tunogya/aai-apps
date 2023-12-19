"use client";

import { FC, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/solid";
import Skeleton from "react-loading-skeleton";

const TgBotInfo: FC<{
  token: string;
}> = ({ token }) => {
  const { data: me, isLoading: isMeLoading } = useSWR(
    token ? `https://api.telegram.org/bot${token}/getMe` : undefined,
    (url) =>
      fetch(url)
        .then((res) => res.json())
        .then((res) => res?.result),
  );
  const {
    data: webhookInfo,
    mutate: mutateWebhook,
    isLoading: isWebhookInfoLoading,
  } = useSWR(
    token ? `https://api.telegram.org/bot${token}/getWebhookInfo` : undefined,
    (url) =>
      fetch(url)
        .then((res) => res.json())
        .then((res) => res?.result),
  );
  const [status, setStatus] = useState("idle");

  const setWebhook = async () => {
    setStatus("loading");
    try {
      await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: `https://app.abandon.ai/api/bot/${token}`,
          max_connections: 100,
          drop_pending_updates: true,
        }),
      });
      setStatus("success");
      await mutateWebhook();
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } catch (e) {
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }
  };

  const isWebhookOk =
    webhookInfo &&
    token &&
    webhookInfo?.url === `https://app.abandon.ai/api/bot/${token}`;

  return (
    <div className={"space-y-2"}>
      <div className={"pt-3 flex items-center"}>
        {isWebhookInfoLoading ? (
          <div className={"h-6 w-6"}>
            <Skeleton className={"w-full h-full"} circle={true} />
          </div>
        ) : isWebhookOk ? (
          <ShieldCheckIcon className={"w-5 h-5 text-[#0066FF]"} />
        ) : (
          <ShieldExclamationIcon className={"w-5 h-5 text-red-500"} />
        )}
        <div className={"font-semibold text-gray-800 h-6 mx-1"}>
          {me?.first_name || (
            <div className={"h-full w-32"}>
              <Skeleton className={"w-full h-full"} />
            </div>
          )}
        </div>
        <Link
          href={`https://t.me/${me?.username}`}
          target={"_blank"}
          className={"text-gray-500 text-sm hover:underline w-32 h-5 mx-1"}
        >
          {me?.username ? (
            `@${me?.username}`
          ) : (
            <div className={"h-full w-20"}>
              <Skeleton className={"w-full h-full"} />
            </div>
          )}
        </Link>
      </div>
      {isWebhookInfoLoading ? (
        <div className={"h-full w-20"}>
          <Skeleton className={"w-full h-full"} />
        </div>
      ) : (
        <button
          className={"border border-gray-300 rounded-md px-2 py-1 text-xs"}
          onClick={setWebhook}
          disabled={status === "loading"}
        >
          {status === "idle" && "Reset webhook"}
          {status === "loading" && "Resetting webhook..."}
          {status === "success" && "Rested webhook!"}
          {status === "error" && "Reset webhook error!"}
        </button>
      )}
    </div>
  );
};

export default TgBotInfo;
