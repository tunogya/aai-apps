"use client";

import useSWR from "swr";
import React, { useState } from "react";
import {
  ArrowPathIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

const ApiKey = () => {
  const { data, mutate, isLoading } = useSWR("/api/token", (url) =>
    fetch(url).then((res) => res.json()),
  );
  const [status, setStatus] = useState("idle");
  const [show, setShow] = useState(false);

  const refreshApiKey = async () => {
    setStatus("loading");
    try {
      await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await mutate();
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }
  };

  const deleteApiKey = async () => {
    setStatus("loading");
    try {
      await fetch("/api/token", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await mutate();
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }
  };

  return (
    <>
      <div className={"flex flex-col gap-4 justify-center"}>
        {isLoading || status === "loading" ? (
          <div className={"p-2 bg-gray-100 w-fit rounded-lg min-w-[360px]"}>
            ...
          </div>
        ) : (
          <div
            className={
              "px-4 py-2 bg-gray-100 w-fit text-sm font-semibold rounded-lg select-text min-w-[360px] cursor-pointer flex items-center justify-between"
            }
            onClick={async () => {
              await navigator.clipboard.writeText(data?.token);
            }}
          >
            {show
              ? data?.token || "No token yet."
              : data?.token
              ? data?.token?.slice(0, 7) + "..." + data?.token?.slice(-4)
              : "No token yet."}
            <DocumentDuplicateIcon className={"w-4 h-4 ml-1"} />
          </div>
        )}
        <div className={"flex gap-2 text-sm h-fit"}>
          <button
            className={
              "px-2 py-1 rounded-lg border hover:bg-gray-500 hover:text-white hover:border-white font-semibold disabled:cursor-wait flex gap-1 items-center"
            }
            onClick={() => setShow(!show)}
            disabled={status !== "idle"}
          >
            {show ? (
              <>
                <EyeSlashIcon className={"w-4 h-4"} />
                Hidden
              </>
            ) : (
              <>
                <EyeIcon className={"w-4 h-4"} />
                Show
              </>
            )}
          </button>
          <button
            className={
              "px-2 py-1 rounded-lg border hover:bg-red-500 hover:text-white hover:border-white font-semibold disabled:cursor-wait flex gap-1 items-center"
            }
            onClick={deleteApiKey}
            disabled={status !== "idle"}
          >
            <TrashIcon className={"w-4 h-4"} />
            Delete
          </button>
          <button
            className={
              "px-2 py-1 rounded-lg border hover:bg-yellow-500 hover:text-white hover:border-white font-semibold disabled:cursor-wait flex gap-1 items-center"
            }
            onClick={refreshApiKey}
            disabled={status !== "idle"}
          >
            <ArrowPathIcon className={"w-4 h-4"} />
            Refresh
          </button>
        </div>
      </div>
      <div
        className={
          "text-sm text-gray-500 select-text cursor-pointer flex items-center"
        }
        onClick={async () => {
          await navigator.clipboard.writeText(
            "https://app.abandon.ai/api/chat/completions",
          );
        }}
      >
        API Endpoint: https://app.abandon.ai/api/chat/completions
        <DocumentDuplicateIcon className={"w-4 h-4 ml-1"} />
      </div>
    </>
  );
};

export default ApiKey;
