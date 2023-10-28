"use client";
import { Switch } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    if (searchParams.get("model") === "GPT-4") {
      setUseGPT4(true);
    } else {
      setUseGPT4(false);
    }
  }, [searchParams]);

  return (
    <div className={"text-sm md:font-semibold"}>
      <div
        className={
          "flex items-center gap-2 py-2 px-4 rounded select-none w-full justify-between cursor-pointer"
        }
        onClick={() => setUseGPT4(!useGPT4)}
      >
        <div
          className={`whitespace-nowrap text-end text-xs ${
            useGPT4 ? "text-[#AB68FF]" : "text-gray-800"
          }`}
        >
          GPT-4 Model
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
