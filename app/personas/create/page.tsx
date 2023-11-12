"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";

const models = [
  { id: 1, name: "gpt-3.5-turbo" },
  { id: 2, name: "gpt-4-1106-preview" },
];

export default function CSRPage() {
  const [selectModel, setSelectModel] = useState(models[0]);

  return (
    <div className={"h-full w-full select-none"}>
      <div
        className={
          "py-5 pl-2 pr-5 text-sm flex items-center justify-between border-b h-[68px] w-full"
        }
      >
        <div
          className={"flex items-center divide-x divide-gray-300 text-gray-800"}
        >
          <Link
            href={"/personas"}
            prefetch
            className={"px-3 pr-4 cursor-pointer"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Link>
          <div className={"pl-5 text-gray-800 font-medium"}>
            Create new Persona
          </div>
        </div>
        <div className={"flex items-center gap-3"}>
          <button
            className={
              "px-2 py-1 rounded-lg text-gray-800 border cursor-pointer font-medium"
            }
            disabled
          >
            Cancel
          </button>
          <button
            className={
              "bg-[#0066FF] px-2 py-1 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
            }
            disabled
          >
            Create
          </button>
        </div>
      </div>
      <div className={"flex h-[calc(100vh-68px)]"}>
        <div
          className={"w-1/2 min-w-[440px] flex justify-center overflow-y-auto"}
        >
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
            </div>
            <div className={"space-y-4 text-gray-800"}>
              <div className={"text-xl font-medium"}>
                Cognitive function priority
              </div>
              <textarea
                placeholder={"What are your Persona's preferences?"}
                className={
                  "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF] min-h-[80px] max-h-[240px]"
                }
              />
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
              <Listbox value={selectModel} onChange={setSelectModel}>
                <div className="relative mt-1">
                  <Listbox.Button
                    className={
                      "relative text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded hover:outline hover:outline-[#0066FF]"
                    }
                  >
                    <div className={"flex items-center justify-between"}>
                      {selectModel.name}
                      <ChevronUpDownIcon className={"w-4 h-4"} />
                    </div>
                  </Listbox.Button>
                  <Listbox.Options
                    className={
                      "absolute mt-1 max-h-60 max-w-[360px] w-full overflow-auto rounded bg-white shadow border py-1"
                    }
                  >
                    {models.map((m) => (
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
              <Listbox value={selectModel} onChange={setSelectModel}>
                <div className="relative mt-1">
                  <Listbox.Button
                    className={
                      "relative text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded hover:outline hover:outline-[#0066FF]"
                    }
                  >
                    <div className={"flex items-center justify-between"}>
                      {selectModel.name}
                      <ChevronUpDownIcon className={"w-4 h-4"} />
                    </div>
                  </Listbox.Button>
                  <Listbox.Options
                    className={
                      "absolute mt-1 max-h-60 max-w-[360px] w-full overflow-auto rounded bg-white shadow border py-1"
                    }
                  >
                    {models.map((m) => (
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
              <Listbox value={selectModel} onChange={setSelectModel}>
                <div className="relative mt-1">
                  <Listbox.Button
                    className={
                      "relative text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded hover:outline hover:outline-[#0066FF]"
                    }
                  >
                    <div className={"flex items-center justify-between"}>
                      {selectModel.name}
                      <ChevronUpDownIcon className={"w-4 h-4"} />
                    </div>
                  </Listbox.Button>
                  <Listbox.Options
                    className={
                      "absolute mt-1 max-h-60 max-w-[360px] w-full overflow-auto rounded bg-white shadow border py-1"
                    }
                  >
                    {models.map((m) => (
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
                  <label
                    htmlFor={"code-interpreter"}
                    className={"cursor-pointer"}
                  >
                    Code interpreter
                  </label>
                </div>
                <div className={"text-sm font-medium border-y py-2 flex gap-2"}>
                  <input
                    type={"checkbox"}
                    id={"retrieval"}
                    className={"cursor-pointer accent-[#0066FF]"}
                  />
                  <label htmlFor={"retrieval"} className={"cursor-pointer"}>
                    Retrieval
                  </label>
                </div>
                {/*<div>*/}
                {/*  <div*/}
                {/*    className={"text-xs font-medium border-y py-4 text-gray-400"}*/}
                {/*  >*/}
                {/*    FILES*/}
                {/*  </div>*/}
                {/*  <div className={"text-gray-400 text-sm py-2"}>*/}
                {/*    Add files to use with code interpreter or retrieval.*/}
                {/*  </div>*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        </div>
        <div className={"w-1/2 bg-gray-100 p-10"}>
          <div className={"text-xl text-gray-800 font-medium"}>Test</div>
        </div>
      </div>
    </div>
  );
}
