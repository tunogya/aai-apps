"use client";
import React from "react";
import useSWR from "swr";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Balance = () => {
  const { data, isLoading } = useSWR("/api/customer", (url) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data),
  );

  return (
    <div
      className={`text-4xl flex items-center ${
        isLoading || data?.balance <= 0 ? "text-gray-800" : "text-red-500"
      }`}
    >
      $
      {isLoading ? (
        <ArrowPathIcon className={"w-4 h-4 animate-spin mx-2"} />
      ) : (
        (data?.balance / 100) * -1
      )}
    </div>
  );
};

export default Balance;
