"use client";
import React from "react";

export default function CSRPage() {
  return (
    <div
      className={
        "absolute h-[calc(100vh-48px)] w-full flex justify-center items-center"
      }
    >
      <button
        className={"underline"}
        onClick={async () => {
          const data = await fetch("/api/billing").then((res) => res.json());
          if (data?.session?.url) {
            window.location.href = data.session.url;
          }
        }}
      >
        Manage billing
      </button>
    </div>
  );
}
