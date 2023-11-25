"use client";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

const voice_options = [
  { id: 1, name: "Alloy" },
  { id: 2, name: "Echo" },
  { id: 3, name: "Fable" },
  { id: 4, name: "Onyx" },
  { id: 5, name: "Nova" },
  { id: 6, name: "Shimmer" },
];

const VoiceOptionSelect = () => {
  const [selectVoiceOption, setSelectVoiceOption] = useState<
    { id: number; name: string } | undefined
  >(undefined);

  useEffect(() => {
    const voice = sessionStorage.getItem("create-assistant-voice");
    if (voice) {
      setSelectVoiceOption(JSON.parse(voice));
    } else {
      setSelectVoiceOption(voice_options[0]);
    }
  }, []);

  useEffect(() => {
    if (selectVoiceOption) {
      sessionStorage.setItem(
        "create-assistant-voice",
        JSON.stringify(selectVoiceOption),
      );
    }
  }, [selectVoiceOption]);

  return (
    <Listbox value={selectVoiceOption} onChange={setSelectVoiceOption}>
      <div className="relative mt-1">
        <Listbox.Button
          className={
            "text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded outline-2 hover:outline hover:outline-[#0066FF]"
          }
        >
          <div className={"flex items-center justify-between"}>
            {selectVoiceOption?.name || "-"}
            <ChevronUpDownIcon className={"w-4 h-4"} />
          </div>
        </Listbox.Button>
        <Listbox.Options
          className={
            "absolute z-10 mt-1 max-h-60 max-w-[360px] w-full overflow-auto rounded bg-white shadow border py-1"
          }
        >
          {voice_options.map((m) => (
            <Listbox.Option
              key={m.id}
              value={m}
              className={"px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"}
            >
              {m.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default VoiceOptionSelect;
