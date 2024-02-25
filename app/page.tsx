"use client";
import React from "react";
import AbandonAI from "@/app/components/AbandonAI";
import TheFooter from "@/app/components/TheFooter";
import AAI from "@/app/components/AAI";

export default function Index() {
  return (
    <div
      className={
        "flex flex-col w-full h-full items-center justify-center flex-1 gap-24 relative"
      }
    >
      <div className={"text-2xl text-white font-semibold"}>
        Applications of abandon.ai
      </div>
      <div
        className={
          "flex flex-col md:flex-row gap-8 w-full p-4 items-center justify-center"
        }
      >
        <AbandonAI />
        <AAI />
      </div>
      <TheFooter />
    </div>
  );
}
