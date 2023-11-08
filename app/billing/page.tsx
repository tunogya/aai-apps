"use client";
import React from "react";
import useSWR from "swr";

export default function CSRPage() {
  const { data } = useSWR("/api/billing", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div
      className={
        "absolute h-[calc(100vh-48px)] w-full flex justify-center items-center"
      }
    >
      {data ? (
        <a href={data.session.url} className={"underline"}>
          Click here to view your billing
        </a>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}
