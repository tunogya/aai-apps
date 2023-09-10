"use client";
import { Switch } from "@headlessui/react";
import { FC, useEffect, useState } from "react";

const Toolbar: FC<{ border?: boolean }> = (props) => {
  const [gpt4model, setGpt4model] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (!init) {
      const initStatus = sessionStorage.getItem("model");
      if (initStatus) {
        setGpt4model(true);
      }
      setInit(true);
    }
  }, [init]);

  useEffect(() => {
    if (gpt4model) {
      sessionStorage.setItem("model", "gpt4");
    } else {
      sessionStorage.removeItem("model");
    }
  }, [gpt4model]);

  if (!init) {
    return null;
  }

  return (
    <div
      className={`h-[60px] w-full flex items-center justify-between px-10 ${
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
      <div className={"text-sm font-semibold flex items-center space-x-3"}>
        <div
          className={
            "flex items-center space-x-2 p-2 rounded cursor-pointer select-none"
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
          relative inline-flex h-[14px] w-[24px] shrink-0 cursor-pointer rounded-full border border-transparent duration-200 ease-in-out focus:outline-none`}
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
        <button
          className={"hover:bg-stone-100 p-1.5 rounded-full text-stone-800"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
