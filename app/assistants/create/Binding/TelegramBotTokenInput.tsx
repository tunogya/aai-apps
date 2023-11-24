"use client";

const TelegramBotTokenInput = () => {
  return (
    <input
      placeholder={"Enter a telegram bot token"}
      className={
        "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF]"
      }
    />
  );
};

export default TelegramBotTokenInput;
