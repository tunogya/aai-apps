"use client";

import Link from "next/link";
import React from "react";
import useSWR from "swr";

const ListPersona = () => {
  const { data, isLoading } = useSWR("/api/persona", (url) =>
    fetch(url).then((res) => res.json()),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.count) {
    return (
      <div className={"h-full"}>
        <div
          className={
            "h-full w-full flex flex-col items-center justify-center gap-3"
          }
        >
          <div className={"font-medium text-gray-800"}>Welcome to Persona</div>
          <div className={"max-w-xs text-sm font-light text-center"}>
            Creating your first persona mask is an exciting journey of
            self-discovery and empowerment.
            <br />
            <Link href={"/new"} className={"underline"}>
              Create my 1st persona
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={"flex flex-col gap-2 text-sm pb-20"}>
      {data.items.map((p: any, index: number) => (
        <div key={index} className={"border p-2"}>
          <div>NAME: {p?.name || "-"}</div>
          <div>MODEL: {p?.model || "-"}</div>
          <div>DESCRIPTION: {p?.description || "-"}</div>
          <div>MODEL: {new Date(p?.created * 1000 || 0).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default ListPersona;
