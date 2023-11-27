"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";

export const SubscribeButton: FC<{
  className?: string;
}> = ({ className }) => {
  const router = useRouter();
  const [status, setStatus] = useState("idle");

  return (
    <button
      className={`${
        className || ""
      } flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded-full font-semibold cursor-pointer w-full justify-center`}
      onClick={async () => {
        try {
          setStatus("loading");
          const { session } = await fetch(`/api/checkout`, {
            method: "POST",
            body: JSON.stringify({
              line_items: [
                {
                  price: "price_1OAAdIFPpv8QfieYpQX1p21d",
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
      {status === "idle" && "Get Premium Standard"}
      {status === "loading" && "Loading..."}
      {status === "success" && "Waiting..."}
      {status === "error" && "Error"}
    </button>
  );
};

export default SubscribeButton;
