import React from "react";
import { Metadata } from "next";
import Image from "next/image";
export const runtime = "edge";

const title = "Auth";
const description = "Powered by OpenAI";

export const metadata: Metadata = {
  title,
  description,
};
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex bg-white gap-5 relative">
      <div className="absolute top-2 left-2 flex items-center gap-2 text-2xl">
        <Image src={"/favicon.svg"} alt={""} width={32} height={32} />
        AbandonAI
      </div>
      {children}
    </div>
  );
}
