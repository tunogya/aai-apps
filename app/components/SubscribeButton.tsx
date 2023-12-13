"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";

export const SubscribeButton: FC<{
  className?: string;
  price: string;
  title: string;
}> = ({ className, price, title }) => {
  const router = useRouter();
  const [status, setStatus] = useState("idle");

  return (
    <button
      className={`${className || ""}`}
      onClick={async () => {
        try {
          setStatus("loading");
          const { session } = await fetch(`/api/checkout`, {
            method: "POST",
            body: JSON.stringify({
              line_items: [
                {
                  price: price,
                  quantity: 1,
                },
              ],
              mode: "subscription",
              allow_promotion_codes: true,
              success_url: `${window.location.origin}/pay/success`,
              cancel_url: `${window.location.origin}/pay/error?error=Canceled`,
            }),
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
      {status === "idle" && title}
      {status === "loading" && "Loading..."}
      {status === "success" && "Waiting..."}
      {status === "error" && "Error"}
    </button>
  );
};

export default SubscribeButton;
