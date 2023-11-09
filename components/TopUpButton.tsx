"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const TopUpButton: FC<{
  className?: string;
}> = ({ className }) => {
  const router = useRouter();
  const [status, setStatus] = useState("idle");

  return (
    <button
      className={`${
        className || ""
      } flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer`}
      onClick={async () => {
        try {
          setStatus("loading");
          const { session } = await fetch(`/api/checkout`, {
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
      <Image
        alt={""}
        src={"/stripe-logos.jpeg"}
        width={20}
        height={20}
        fetchPriority={"low"}
      />
      {status === "idle" && "Buy credits"}
      {status === "loading" && "Loading..."}
      {status === "success" && "Waiting..."}
      {status === "error" && "Error"}
    </button>
  );
};

export default TopUpButton;
