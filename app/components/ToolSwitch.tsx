"use client";
import { Switch } from "@headlessui/react";
import React from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

const ToolSwitch = () => {
  const [tool, setTool] = useLocalStorage("chat-tool", "false");

  return (
    <div className={"text-sm md:font-semibold md:hover:bg-gray-100 rounded-lg"}>
      <div
        className={
          "flex items-center gap-2 px-2 py-1.5 rounded select-none w-full justify-between cursor-pointer"
        }
        onClick={() => {
          if (tool === "false") {
            setTool("true");
          } else {
            setTool("false");
          }
        }}
      >
        <div
          className={`whitespace-nowrap text-sm font-medium ${
            tool === "true" ? "text-[#0066FF]" : "text-gray-800"
          }`}
        >
          Tools
        </div>
        <Switch
          checked={tool === "true"}
          className={`${tool === "true" ? "bg-[#0066FF]" : "bg-gray-200"}
          relative inline-flex h-[14px] w-[24px] shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Tools</span>
          <span
            aria-hidden="true"
            className={`${tool === "true" ? "translate-x-2.5" : "translate-x-0"}
            pointer-events-none inline-block h-[12px] w-[12px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>
    </div>
  );
};

export default ToolSwitch;
