"use client";
import { Switch } from "@headlessui/react";
import React from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const ModelSwitch = () => {
  const [model, setModel] = useLocalStorage("chat-model", "gpt-3.5");

  const useGPT4 = model.startsWith("gpt-4");
  const useVision = model === "gpt-4-vision";

  return (
    <div className={"gap-1 flex items-center"}>
      {useVision && (
        <div className={"text-xs font-light px-1"}>
          (GPT-4 Vision is open, you can&apos;t use other functions in this
          mode)
        </div>
      )}
      {useGPT4 && (
        <div className={"border rounded-lg px-2 h-6 md:h-8 flex items-center"}>
          <button
            className={`text-sm md:font-semibold rounded-lg flex items-center gap-2 justify-between ${
              useVision ? "text-[#AB68FF]" : "text-gray-800"
            }`}
            onClick={() => {
              if (useVision) {
                setModel("gpt-4");
              } else {
                setModel("gpt-4-vision");
              }
            }}
          >
            {useVision ? (
              <EyeIcon className={"w-4 h-4 stroke-1.5"} />
            ) : (
              <EyeSlashIcon className={"w-4 h-4 stroke-1.5"} />
            )}
          </button>
        </div>
      )}
      <div
        className={`text-sm md:font-semibold md:hover:bg-gray-100 rounded-lg flex items-center gap-2 px-2 py-1 md:py-1.5 select-none justify-between cursor-pointer`}
        onClick={() => {
          if (useGPT4) {
            setModel("gpt-3.5");
          } else {
            setModel("gpt-4");
          }
        }}
      >
        <div
          className={`whitespace-nowrap text-xs md:text-sm font-medium ${
            useGPT4 ? "text-[#AB68FF]" : "text-gray-800"
          }`}
        >
          GPT-4
        </div>
        <Switch
          checked={useGPT4}
          className={`${useGPT4 ? "bg-[#AB68FF]" : "bg-gray-200"} drop-shadow-sm
          relative flex h-[18px] w-[33px] shrink-0 cursor-pointer rounded-full shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">GPT-4</span>
          <span
            aria-hidden="true"
            className={`${
              useGPT4 ? "translate-x-4" : "translate-x-0"
            } drop-shadow-sm
            pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>
    </div>
  );
};

export default ModelSwitch;
