"use client";

import { useEffect, useState } from "react";

const InstructionsInput = () => {
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    const name = sessionStorage.getItem("create-assistant-instructions");
    if (name) {
      setInstructions(name);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("create-assistant-instructions", instructions);
  }, [instructions]);

  return (
    <textarea
      value={instructions}
      onChange={(e) => setInstructions(e.target.value)}
      placeholder={"You are a helpful assistant."}
      className={
        "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF] min-h-[80px] max-h-[240px]"
      }
    />
  );
};

export default InstructionsInput;
