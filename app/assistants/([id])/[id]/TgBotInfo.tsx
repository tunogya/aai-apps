"use client";

import { FC, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { FaceFrownIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";

const TgBotInfo: FC<{
  token: string;
  webhook: string;
}> = ({ token, webhook }) => {
  const { data: me, isLoading: isMeLoading } = useSWR(
    token ? `https://api.telegram.org/bot${token}/getMe` : undefined,
    (url) =>
      fetch(url)
        .then((res) => res.json())
        .then((res) => res?.result),
  );
  const {
    data: webhookInfo,
    isLoading: isWebhookInfoLoading,
    mutate: mutateWebhook,
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
          url: webhook,
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

  return (
    <div className={"space-y-2"}>
      <div className={"pt-3 flex items-center space-x-3"}>
        <div className={"font-semibold text-gray-800 h-6"}>
          {me?.first_name || (
            <div className={"h-full w-32"}>
              <Skeleton className={"w-full h-full"} />
            </div>
          )}
        </div>
        <Link
          href={`https://t.me/${me?.username}`}
          target={"_blank"}
          className={"text-gray-500 text-sm hover:underline w-32 h-5"}
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
      <div className={"text-gray-500 flex items-center space-x-1"}>
        <div>Webhook status:</div>
        {!isWebhookInfoLoading && webhook === webhookInfo?.url ? (
          <div>
            <FaceSmileIcon className={"w-6 h-6 text-green-500"} />
          </div>
        ) : (
          <div className={"flex items-center space-x-2"}>
            <FaceFrownIcon className={"w-6 h-6 text-red-500"} />
            <button
              onClick={setWebhook}
              className={"bg-red-500 text-white text-sm px-2 py-1 rounded"}
            >
              {status === "idle" && "Update webhook!"}
              {status === "loading" && "Updating..."}
              {status === "success" && "Updated!"}
              {status === "error" && "Error!"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TgBotInfo;
