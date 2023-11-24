"use client";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

const response_strategy = [
  { id: 1, name: "Escape" },
  { id: 2, name: "Coping" },
  { id: 3, name: "Logic" },
  { id: 4, name: "Emotion" },
];

const ResponseStrategySelect = () => {
  const [selectResponseStrategy, setSelectResponseStrategy] = useState(
    response_strategy[0],
  );

  return (
    <Listbox
      value={selectResponseStrategy}
      onChange={setSelectResponseStrategy}
    >
      <div className="relative mt-1">
        <Listbox.Button
          className={
            "text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded outline-2 hover:outline hover:outline-[#0066FF]"
          }
        >
          <div className={"flex items-center justify-between"}>
            {selectResponseStrategy.name}
            <ChevronUpDownIcon className={"w-4 h-4"} />
          </div>
        </Listbox.Button>
        <Listbox.Options
          className={
            "absolute z-10 mt-1 max-h-60 max-w-[360px] w-full overflow-auto rounded bg-white shadow border py-1"
          }
        >
          {response_strategy.map((m) => (
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

export default ResponseStrategySelect;
