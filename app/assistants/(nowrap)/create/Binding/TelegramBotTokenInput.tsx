"use client";

import { useEffect, useState } from "react";

const TelegramBotTokenInput = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("create-assistant-tg-token");
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("create-assistant-tg-token", token);
  }, [token]);

  return (
    <input
      value={token}
      type={"password"}
      onChange={(e) => setToken(e.target.value)}
      placeholder={"Enter a telegram bot token"}
      className={
        "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF]"
      }
    />
  );
};

export default TelegramBotTokenInput;
