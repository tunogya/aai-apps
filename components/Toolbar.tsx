"use client";
import { Switch } from "@headlessui/react";
import { FC, useEffect, useState } from "react";

const Toolbar: FC<{ border?: boolean }> = (props) => {
  const [gpt4model, setGpt4model] = useState(false);

  useEffect(() => {
    if (gpt4model) {
      sessionStorage.setItem("model", "gpt4");
    } else {
      sessionStorage.removeItem("model");
    }
  }, [gpt4model]);

  return (
    <div
      className={`h-[60px] w-full flex items-center justify-between px-8 ${
        props.border ? "border-b" : ""
      }`}
    >
      <div className={"lg:w-[240px] xl:w-[300px]"}>
        <input
          placeholder={"Search"}
          className={
            "w-full px-4 py-2 focus:bg-stone-100 hover:bg-stone-100 focus:outline-0 rounded text-sm"
          }
        />
      </div>
      <div className={"text-sm font-semibold"}>
        <div
          className={
            "flex items-center space-x-2 hover:bg-stone-100 p-2 rounded cursor-pointer select-none"
          }
          onClick={() => setGpt4model(!gpt4model)}
        >
          <div
            className={`flex space-x-1 text-sm ${
              gpt4model ? "text-purple-500" : "text-stone-800"
            }`}
          >
            {gpt4model && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="none"
                className="h-4 w-4 transition-colors  group-hover/button:text-brand-purple"
                width="16"
                height="16"
                strokeWidth="2"
              >
                <path
                  d="M12.784 1.442a.8.8 0 0 0-1.569 0l-.191.953a.8.8 0 0 1-.628.628l-.953.19a.8.8 0 0 0 0 1.57l.953.19a.8.8 0 0 1 .628.629l.19.953a.8.8 0 0 0 1.57 0l.19-.953a.8.8 0 0 1 .629-.628l.953-.19a.8.8 0 0 0 0-1.57l-.953-.19a.8.8 0 0 1-.628-.629l-.19-.953h-.002ZM5.559 4.546a.8.8 0 0 0-1.519 0l-.546 1.64a.8.8 0 0 1-.507.507l-1.64.546a.8.8 0 0 0 0 1.519l1.64.547a.8.8 0 0 1 .507.505l.546 1.641a.8.8 0 0 0 1.519 0l.546-1.64a.8.8 0 0 1 .506-.507l1.641-.546a.8.8 0 0 0 0-1.519l-1.64-.546a.8.8 0 0 1-.507-.506L5.56 4.546Zm5.6 6.4a.8.8 0 0 0-1.519 0l-.147.44a.8.8 0 0 1-.505.507l-.441.146a.8.8 0 0 0 0 1.519l.44.146a.8.8 0 0 1 .507.506l.146.441a.8.8 0 0 0 1.519 0l.147-.44a.8.8 0 0 1 .506-.507l.44-.146a.8.8 0 0 0 0-1.519l-.44-.147a.8.8 0 0 1-.507-.505l-.146-.441Z"
                  fill="currentColor"
                ></path>
              </svg>
            )}
            <div className={"whitespace-nowrap"}>
              {gpt4model ? "GPT-4 Model" : "GPT-3.5 Model"}
            </div>
          </div>
          <Switch
            checked={gpt4model}
            // onChange={setEnabled}
            className={`${gpt4model ? "bg-purple-500" : "bg-stone-200"}
          relative inline-flex h-[14px] w-[24px] shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className="sr-only">
              {gpt4model ? "GPT-4 Model" : "GPT-3.5 Model"}
            </span>
            <span
              aria-hidden="true"
              className={`${gpt4model ? "translate-x-2.5" : "translate-x-0"}
            pointer-events-none inline-block h-[12px] w-[12px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
