"use client";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

const communication_styles = [
  { id: 1, name: "Direct" },
  { id: 2, name: "Indirect" },
  { id: 3, name: "Text" },
  { id: 4, name: "Audio" },
];

const response_strategy = [
  { id: 1, name: "Escape" },
  { id: 2, name: "Coping" },
  { id: 3, name: "Logic" },
  { id: 4, name: "Emotion" },
];

const social_preferences = [
  { id: 1, name: "Group" },
  { id: 2, name: "Individual" },
  { id: 3, name: "Active" },
  { id: 4, name: "Observation" },
];

const CreateForm = () => {
  const [selectCommunicationStyle, setSelectCommunicationStyle] = useState(
    communication_styles[0],
  );
  const [selectResponseStrategy, setSelectResponseStrategy] = useState(
    response_strategy[0],
  );
  const [selectSocialPreferences, setSelectSocialPreferences] = useState(
    social_preferences[0],
  );

  return (
    <div className={"p-10 min-w-[360px] w-[608px] space-y-8 h-fit pb-40"}>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Name</div>
        <input
          placeholder={"Enter your Persona name"}
          className={
            "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF]"
          }
        />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Personality types</div>
        <input
          placeholder={"Enter your Persona name"}
          className={
            "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF]"
          }
        />
        <div className={"text-sm text-gray-400"}>
          You can change the order of four words to adjust the priority of
          cognitive functions.
        </div>
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Hobbies and interests</div>
        <textarea
          placeholder={"What are your Persona's preferences?"}
          className={
            "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF] min-h-[80px] max-h-[240px]"
          }
        />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Values and beliefs</div>
        <textarea
          placeholder={"What are your Persona's preferences?"}
          className={
            "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF] min-h-[80px] max-h-[240px]"
          }
        />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Communication style</div>
        <Listbox
          value={selectCommunicationStyle}
          onChange={setSelectCommunicationStyle}
        >
          <div className="relative mt-1">
            <Listbox.Button
              className={
                "text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded hover:outline hover:outline-[#0066FF]"
              }
            >
              <div className={"flex items-center justify-between"}>
                {selectCommunicationStyle.name}
                <ChevronUpDownIcon className={"w-4 h-4"} />
              </div>
            </Listbox.Button>
            <Listbox.Options
              className={
                "absolute z-10 mt-1 max-h-60 max-w-[360px] w-full overflow-auto rounded bg-white shadow border py-1"
              }
            >
              {communication_styles.map((m) => (
                <Listbox.Option
                  key={m.id}
                  value={m}
                  className={
                    "px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                  }
                >
                  {m.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Response strategy</div>
        <Listbox
          value={selectResponseStrategy}
          onChange={setSelectResponseStrategy}
        >
          <div className="relative mt-1">
            <Listbox.Button
              className={
                "text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded hover:outline hover:outline-[#0066FF]"
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
                  className={
                    "px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                  }
                >
                  {m.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Social preferences</div>
        <Listbox
          value={selectSocialPreferences}
          onChange={setSelectSocialPreferences}
        >
          <div className="relative mt-1">
            <Listbox.Button
              className={
                "text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded hover:outline hover:outline-[#0066FF]"
              }
            >
              <div className={"flex items-center justify-between"}>
                {selectSocialPreferences.name}
                <ChevronUpDownIcon className={"w-4 h-4"} />
              </div>
            </Listbox.Button>
            <Listbox.Options
              className={
                "absolute z-10 mt-1 max-h-60 max-w-[360px] w-full overflow-auto rounded bg-white shadow border py-1"
              }
            >
              {social_preferences.map((m) => (
                <Listbox.Option
                  key={m.id}
                  value={m}
                  className={
                    "px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                  }
                >
                  {m.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xs font-medium text-gray-500"}>Tools</div>
        <div>
          {/*<div className={"text-sm font-medium border-t py-2"}>*/}
          {/*  <div>*/}
          {/*    Function*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className={"text-sm font-medium border-t py-2 flex gap-2"}>
            <input
              type={"checkbox"}
              id={"code-interpreter"}
              className={"cursor-pointer accent-[#0066FF]"}
            />
            <label htmlFor={"code-interpreter"} className={"cursor-pointer"}>
              Code interpreter
            </label>
          </div>
          <div className={"text-sm font-medium border-t py-2 flex gap-2"}>
            <input
              type={"checkbox"}
              id={"retrieval"}
              className={"cursor-pointer accent-[#0066FF]"}
            />
            <label htmlFor={"retrieval"} className={"cursor-pointer"}>
              Retrieval
            </label>
          </div>
          <div>
            <div className={"text-xs font-medium border-y py-4 text-gray-400"}>
              FILES
            </div>
            <div className={"text-gray-400 text-sm py-2"}>
              Add files to use with code interpreter or retrieval.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
