"use client";
import { Switch } from "@headlessui/react";
import React from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

const ModelSwitch = () => {
  const [model, setModel] = useLocalStorage("chat-model", "gpt-3.5-turbo");

  const useGPT4 = model.startsWith("gpt-4");
  console.log(model, useGPT4);
  return (
    <div className={"text-sm md:font-semibold md:hover:bg-gray-100 rounded-lg"}>
      <div
        className={
          "flex items-center gap-2 px-2 py-1.5 rounded select-none w-full justify-between cursor-pointer"
        }
        onClick={() => {
          if (model.startsWith("gpt-4")) {
            setModel("gpt-3.5-turbo");
          } else {
            setModel("gpt-4-1106-preview");
          }
        }}
      >
        <div
          className={`whitespace-nowrap text-sm font-medium ${
            useGPT4 ? "text-[#AB68FF]" : "text-gray-800"
          }`}
        >
          GPT-4
        </div>
        <Switch
          checked={useGPT4}
          className={`${useGPT4 ? "bg-[#AB68FF]" : "bg-gray-200"}
          relative inline-flex h-[14px] w-[24px] shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">GPT-4</span>
          <span
            aria-hidden="true"
            className={`${useGPT4 ? "translate-x-2.5" : "translate-x-0"}
            pointer-events-none inline-block h-[12px] w-[12px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>
    </div>
  );
};

export default ModelSwitch;
