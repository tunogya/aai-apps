"use client";
import React from "react";
import useSWR from "swr";

const Balance = () => {
  const { data, isLoading } = useSWR("/api/customer", (url) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data),
  );

  return (
    <div className={"text-4xl text-gray-800"}>
      ${isLoading ? "-" : (data?.balance / 100) * -1}
    </div>
  );
};

export default Balance;
