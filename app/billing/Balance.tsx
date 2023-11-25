"use client";
import React from "react";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Balance = () => {
  const { data, isLoading } = useSWR("/api/customer", (url) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data),
  );

  return (
    <div className={`text-4xl flex items-center`}>
      <div>$</div>
      <div className={"w-[240px]"}>
        {isLoading ? <Skeleton /> : (data?.balance / 100) * -1}
      </div>
    </div>
  );
};

export default Balance;
