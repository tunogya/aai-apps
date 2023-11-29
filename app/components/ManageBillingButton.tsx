"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";

const ManageBillingButton: FC<{
  className?: string;
}> = ({ className }) => {
  const router = useRouter();
  const [status, setStatus] = useState("idle");

  return (
    <button
      className={`${className || ""}`}
      onClick={async () => {
        try {
          setStatus("loading");
          const { session } = await fetch("/api/billing", {
            method: "POST",
          }).then((res) => res.json());
          if (session?.url) {
            setStatus("success");
            router.push(session.url);
            setTimeout(() => {
              setStatus("idle");
            }, 3_000);
          } else {
            setStatus("error");
            setTimeout(() => {
              setStatus("idle");
            }, 3_000);
          }
        } catch (e) {
          setStatus("error");
          setTimeout(() => {
            setStatus("idle");
          }, 3_000);
        }
      }}
    >
      {status === "idle" && "Manage billing"}
      {status === "loading" && "Loading..."}
      {status === "success" && "Waiting..."}
      {status === "error" && "Error"}
    </button>
  );
};

export default ManageBillingButton;
