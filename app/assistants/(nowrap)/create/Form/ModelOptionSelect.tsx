"use client";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

const model_options = [
  { id: 1, name: "gpt-4-1106-preview" },
  { id: 2, name: "gpt-4" },
  { id: 3, name: "gpt-3.5-turbo-16k" },
  { id: 4, name: "gpt-3.5-turbo" },
];

const ModelOptionSelect = () => {
  const [selectModel, setSelectModel] = useState<
    { id: number; name: string } | undefined
  >(undefined);

  useEffect(() => {
    const voice = sessionStorage.getItem("create-assistant-model");
    if (voice) {
      setSelectModel(JSON.parse(voice));
    } else {
      setSelectModel(model_options[0]);
    }
  }, []);

  useEffect(() => {
    if (selectModel) {
      sessionStorage.setItem(
        "create-assistant-model",
        JSON.stringify(selectModel),
      );
    }
  }, [selectModel]);

  return (
    <Listbox value={selectModel} onChange={setSelectModel}>
      <div className="relative mt-1">
        <Listbox.Button
          className={
            "text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded outline-2 hover:outline hover:outline-[#0066FF]"
          }
        >
          <div className={"flex items-center justify-between"}>
            {selectModel?.name || "-"}
            <ChevronUpDownIcon className={"w-4 h-4"} />
          </div>
        </Listbox.Button>
        <Listbox.Options
          className={
            "absolute z-10 mt-1 max-h-60 max-w-[360px] w-full overflow-auto rounded bg-white shadow border py-1"
          }
        >
          {model_options.map((m) => (
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

export default ModelOptionSelect;
