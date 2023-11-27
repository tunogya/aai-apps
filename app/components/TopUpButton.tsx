"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";

export const TopUpButton: FC<{
  className?: string;
}> = ({ className }) => {
  const router = useRouter();
  const [status, setStatus] = useState("idle");

  return (
    <button
      className={`${
        className || ""
      } flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer hover:shadow`}
      onClick={async () => {
        try {
          setStatus("loading");
          const { session } = await fetch(`/api/checkout`, {
            method: "POST",
            body: JSON.stringify({
              line_items: [
                {
                  price: "price_1NtMGxFPpv8QfieYD2d3FSwe",
                  quantity: 1,
                },
              ],
              mode: "payment",
              allow_promotion_codes: false,
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
      {status === "idle" && "Buy credits"}
      {status === "loading" && "Loading..."}
      {status === "success" && "Waiting..."}
      {status === "error" && "Error"}
    </button>
  );
};

export default TopUpButton;
