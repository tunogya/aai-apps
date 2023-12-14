"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import dysortid from "@/app/utils/dysortid";
import { useEffect } from "react";

const CSR = () => {
  const router = useRouter();
  const { data, isLoading } = useSWR("/api/billing", (url) =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json()),
  );

  useEffect(() => {
    if (data?.session?.url) {
      router.push(data?.session?.url);
    }
    return () => {
      if (data?.session?.url) {
        router.push(data?.session?.url);
      }
    };
  }, [data, isLoading]);

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center gap-3 ${
        isLoading ? "animate-pulse" : ""
      } text-gray-800 relative`}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M68 68V956H956V68H68ZM142 882V142H586V413.333L512 216H438L216 808H290L345.5 660H586V882H142ZM576.791 586H373.209L475 314.667L576.791 586Z"
          fill="currentColor"
        />
      </svg>
      {isLoading ? (
        "Prepare your account..."
      ) : (
        <div className={""}>
          {data?.session?.url && (
            <a href={data.session.url} className={""}>
              Going to Stripe...
            </a>
          )}
        </div>
      )}
      <Link
        href={`/chat/${dysortid()}`}
        className={"underline absolute bottom-4"}
      >
        Back to AbandonAI
      </Link>
    </div>
  );
};

export default CSR;
