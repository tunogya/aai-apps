"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";

export const DepositButton: FC<{
  className?: string;
}> = ({ className }) => {
  const router = useRouter();
  const [status, setStatus] = useState("idle");

  return (
    <button
      disabled
      className={className || ""}
      onClick={async () => {
        try {
          setStatus("loading");
          const { session } = await fetch(`/api/checkout`, {
            method: "POST",
          }).then((res) => res.json());
          const url = session.url;
          setStatus("idle");
          router.push(url);
        } catch (e) {
          console.log(e);
          setStatus("error");
          setTimeout(() => {
            setStatus("idle");
          }, 3_000);
        }
      }}
    >
      {status === "idle" && "Top-up"}
      {status === "loading" && "Waiting..."}
      {status === "error" && "Error"}
    </button>
  );
};

export default DepositButton;
