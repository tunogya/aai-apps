"use client";
import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { nanoid } from "ai";
import { useRouter } from "next/navigation";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import Skeleton from "react-loading-skeleton";

const Help = dynamic(() => import("@/app/assistants/(nowrap)/create/Help"), {
  loading: () => <Skeleton />,
});

const voice_options = ["Alloy", "Echo", "Fable", "Onyx", "Nova", "Shimmer"];

const model_options = [
  "gpt-4-1106-preview",
  "gpt-4",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo",
];

export default function CSRPage() {
  const [form, setForm] = useState({
    assistant_id: "",
    name: "",
    instructions: "",
    voice: "",
    model: "",
  });
  const router = useRouter();
  const create = async () => {
    const assistant_id = nanoid();

    try {
      const result = await fetch(`/api/assistants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }).then((res) => res.json());
      if (result?.success) {
        router.push("/assistants");
      }
    } catch (e) {
      router.back();
    }
  };

  return (
    <div className={"h-full w-full"}>
      <div
        className={
          "py-5 pl-2 pr-5 text-sm flex items-center justify-between border-b h-[68px] w-full"
        }
      >
        <div
          className={"flex items-center divide-x divide-gray-300 text-gray-800"}
        >
          <Link
            href={"/assistants"}
            prefetch
            className={"px-3 pr-4 cursor-pointer"}
          >
            <XMarkIcon className={"w-4 h-4 stroke-2"} />
          </Link>
          <div className={"pl-5 text-gray-800 font-medium"}>
            Create an assistant
          </div>
        </div>
        <div className={"flex items-center gap-3"}>
          <button
            className={
              "px-2 py-1 rounded-lg text-gray-800 border cursor-pointer font-medium"
            }
            onClick={() => {
              router.back();
            }}
          >
            Cancel
          </button>
          <button
            onClick={create}
            className={
              "bg-[#0066FF] px-2 py-1 rounded-lg text-white disabled:cursor-auto cursor-pointer font-medium"
            }
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
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder={"Enter a user friendly name"}
                className={
                  "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF]"
                }
              />
            </div>
            <div className={"space-y-4 text-gray-800"}>
              <div className={"text-xl font-medium"}>Instructions</div>
              <textarea
                value={form.instructions}
                onChange={(e) =>
                  setForm({
                    ...form,
                    instructions: e.target.value,
                  })
                }
                placeholder={"You are a helpful assistant."}
                className={
                  "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF] min-h-[80px] max-h-[240px]"
                }
              />
            </div>
            <div className={"space-y-4 text-gray-800"}>
              <div className={"text-xl font-medium"}>Voice</div>
              <Listbox
                value={form.voice}
                onChange={(m) => setForm({ ...form, voice: m })}
              >
                <div className="relative mt-1">
                  <Listbox.Button
                    className={
                      "text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded outline-2 hover:outline hover:outline-[#0066FF]"
                    }
                  >
                    <div className={"flex items-center justify-between"}>
                      {form?.voice || "-"}
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
                        key={m}
                        value={m}
                        className={
                          "px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                        }
                      >
                        {m}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            <div className={"space-y-4 text-gray-800"}>
              <div className={"text-xl font-medium"}>Model</div>
              <Listbox
                value={form.model}
                onChange={(m) => setForm({ ...form, model: m })}
              >
                <div className="relative mt-1">
                  <Listbox.Button
                    className={
                      "text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded outline-2 hover:outline hover:outline-[#0066FF]"
                    }
                  >
                    <div className={"flex items-center justify-between"}>
                      {form?.model || "-"}
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
                        key={m}
                        value={m}
                        className={
                          "px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                        }
                      >
                        {m}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
        <div className={"w-1/2 bg-gray-100 p-10"}>
          <Help />
        </div>
      </div>
    </div>
  );
}
