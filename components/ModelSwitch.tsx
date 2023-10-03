"use client";
import { Switch } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ModelSwitch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [useGPT4, setUseGPT4] = useState(searchParams.get("model") === "GPT-4");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (useGPT4) {
      params.set("model", "GPT-4");
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      params.set("model", "GPT-3.5");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [useGPT4]);

  return (
    <div className={"text-sm font-semibold bg-gray-100 md:bg-white"}>
      <div
        className={
          "flex items-center space-x-2 p-2 rounded cursor-pointer select-none w-full justify-center"
        }
        onClick={() => setUseGPT4(!useGPT4)}
      >
        <div
          className={`flex space-x-1 text-sm ${
            useGPT4 ? "text-[#AB68FF]" : "text-gray-800"
          }`}
        >
          <div className={"whitespace-nowrap w-[110px] text-end"}>
            {useGPT4 ? "GPT-4 Model" : "GPT-3.5 Model"}
          </div>
        </div>
        <Switch
          checked={useGPT4}
          className={`${useGPT4 ? "bg-[#AB68FF]" : "bg-gray-200"}
          relative inline-flex h-[14px] w-[24px] shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">GPT-4 Model</span>
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
