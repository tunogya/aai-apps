"use client";

import { FC, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import moment from "moment/moment";

const TelegramInfo: FC<{
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

  const setWebhook = async (url: string) => {
    setStatus("loading");
    try {
      await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          max_connections: 100,
          drop_pending_updates: true,
        }),
      });
      await mutateWebhook();
      setStatus("idle");
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
    webhookInfo?.url === `https://api.abandon.ai/webhook/telegram/${token}`;

  return (
    <div className={"space-y-2"}>
      <div className={"pt-3 flex items-center"}>
        {isWebhookInfoLoading ? (
          <div className={"h-6 w-6"}>
            <Skeleton className={"w-full h-full"} circle={true} />
          </div>
        ) : (
          <div
            className={`h-3 w-3 rounded-full ${
              status === "loading"
                ? "bg-yellow-300"
                : isWebhookOk
                ? "bg-green-500"
                : "bg-red-500"
            } m-1`}
          />
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
        <div className={"flex items-center gap-2"}>
          {isWebhookOk ? (
            <>
              <button
                className={
                  "border border-gray-300 rounded-md px-2 py-1 text-xs hover:shadow"
                }
                onClick={async () => {
                  await setWebhook(``);
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  await setWebhook(
                    `https://api.abandon.ai/webhook/telegram/${token}`,
                  );
                }}
                disabled={status === "loading"}
              >
                {status === "idle" && "Restart"}
                {status === "loading" && "Sleeping..."}
                {status === "error" && "Error!"}
              </button>
              {status !== "loading" && (
                <button
                  className={
                    "border border-gray-300 rounded-md px-2 py-1 text-xs hover:shadow"
                  }
                  onClick={() => setWebhook(``)}
                  disabled={status === "loading"}
                >
                  {status === "idle" && "Shutdown"}
                  {status === "loading" && "Sleeping..."}
                  {status === "error" && "Error!"}
                </button>
              )}
            </>
          ) : (
            <button
              className={
                "border border-gray-300 rounded-md px-2 py-1 text-xs hover:shadow"
              }
              onClick={() =>
                setWebhook(`https://api.abandon.ai/webhook/telegram/${token}`)
              }
              disabled={status === "loading"}
            >
              {status === "idle" && "Wake up"}
              {status === "loading" && "Initializing..."}
              {status === "error" && "Error!"}
            </button>
          )}
        </div>
      )}
      {webhookInfo?.pending_update_count > 0 && (
        <div className={"text-gray-500 text-xs flex gap-1"}>
          {moment(webhookInfo?.last_error_date * 1000)
            .startOf("second")
            .fromNow()}
          ,{webhookInfo?.last_error_message},pending update count:{" "}
          {webhookInfo?.pending_update_count}
        </div>
      )}
    </div>
  );
};

export default TelegramInfo;
