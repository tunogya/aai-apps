"use client";

import { useEffect, useState } from "react";

const NameInput = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    const name = sessionStorage.getItem("create-assistant-name");
    if (name) {
      setName(name);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("create-assistant-name", name);
  }, [name]);

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder={"Enter a user friendly name"}
      className={
        "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF]"
      }
    />
  );
};

export default NameInput;
