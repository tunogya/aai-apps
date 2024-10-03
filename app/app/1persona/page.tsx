"use client";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div
      className={
        "text-white p-4 flex flex-col items-center justify-center h-full text-[12px] leading-[18px] text-[#B3B3B3]"
      }
    >
      <div>{error && <div>Error: {error}</div>}</div>
    </div>
  );
};

export default Page;
