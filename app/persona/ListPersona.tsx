"use client";

import Link from "next/link";
import React from "react";
import useSWR from "swr";
import moment from "moment";

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
      {data.items
        .sort((a: any, b: any) => b.created - a.created)
        .map((p: any, index: number) => (
          <div
            key={index}
            className={"border-b px-2 py-4 flex flex-col space-y-3"}
          >
            <div className={"flex items-center space-x-2"}>
              <div className={"text-xl font-semibold"}>{p?.name || "-"}</div>
              <div
                className={
                  "px-1.5 py-0.5 border rounded-full text-xs text-gray-500"
                }
              >
                {p?.model || "-"}
              </div>
            </div>
            {p?.description && (
              <div className={"text-sm text-gray-500"}>{p.description}</div>
            )}
            <div className={"text-xs text-gray-500"}>
              Created {moment(new Date(p?.created * 1000 || 0)).fromNow()} {}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ListPersona;
