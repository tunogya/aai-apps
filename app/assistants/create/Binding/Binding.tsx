"use client";
import React from "react";
import dynamic from "next/dynamic";
const TelegramBotTokenInput = dynamic(() => import("./TelegramBotTokenInput"));

const Binding = () => {
  return (
    <div className={"text-xl text-gray-800 font-medium"}>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Telegram Bot Token</div>
        <TelegramBotTokenInput />
      </div>
    </div>
  );
};

export default Binding;
