"use client";

import useSWR from "swr";
import { useState } from "react";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/solid";

const ApiKey = () => {
  const { data, mutate, isLoading } = useSWR("/api/token", (url) =>
    fetch(url).then((res) => res.json()),
  );
  const [status, setStatus] = useState("idle");

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
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
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
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (e) {
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }
  };

  return (
    <div className={"text-gray-800 flex flex-col gap-2"}>
      <div className={"text-2xl font-semibold border-b py-2"}>API Key</div>
      <div className={"flex gap-4 items-center"}>
        {isLoading || status === "loading" ? (
          <div className={"p-2 bg-gray-100 w-fit rounded-lg"}>Loading...</div>
        ) : (
          <div className={"px-4 py-2 bg-gray-100 w-fit rounded-lg select-text"}>
            {data?.token || "-"}
          </div>
        )}
        <div className={"flex gap-2 text-sm h-fit"}>
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
    </div>
  );
};

export default ApiKey;
