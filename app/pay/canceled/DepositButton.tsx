"use client";
import React, { useState } from "react";

export const DepositButton = () => {
  const [status, setStatus] = useState("idle");

  return (
    <button
      className={"text-gray-500 hover:text-black text-sm underline"}
      onClick={async () => {
        try {
          setStatus("loading");
          const { session } = await fetch(`/api/checkout`, {
            method: "POST",
          }).then((res) => res.json());
          const url = session.url;
          setStatus("idle");
          window.open(url);
        } catch (e) {
          console.log(e);
          setStatus("error");
          setTimeout(() => {
            setStatus("idle");
          }, 3_000);
        }
      }}
    >
      {status === "idle" && "Deposit"}
      {status === "loading" && "Waiting..."}
      {status === "error" && "Error"}
    </button>
  );
};
