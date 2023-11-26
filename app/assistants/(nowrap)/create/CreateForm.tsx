import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import React, { FC } from "react";

const voice_options = ["Alloy", "Echo", "Fable", "Onyx", "Nova", "Shimmer"];

const model_options = [
  "gpt-4-1106-preview",
  "gpt-4",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo",
];

const CreateForm: FC<{
  createParams: any;
  setCreateParams: (createParams: any) => void;
}> = ({ createParams, setCreateParams }) => {
  return (
    <div className={"p-10 min-w-[360px] w-[608px] space-y-8 h-fit pb-40"}>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Name*</div>
        <input
          maxLength={256}
          value={createParams?.name || ""}
          onChange={(e) =>
            setCreateParams({
              ...createParams,
              name: e.target.value,
            })
          }
          placeholder={"Enter a user friendly name."}
          className={
            "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF]"
          }
        />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Description</div>
        <textarea
          maxLength={512}
          value={createParams?.description || ""}
          onChange={(e) =>
            setCreateParams({
              ...createParams,
              description: e.target.value,
            })
          }
          placeholder={"The description of the assistant."}
          className={
            "border text-sm overflow-x-scroll max-w-[360px] w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF] min-h-[80px] max-h-[240px]"
          }
        />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Instructions</div>
        <textarea
          maxLength={32768}
          value={createParams?.instructions || ""}
          onChange={(e) =>
            setCreateParams({
              ...createParams,
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
          // @ts-ignore
          value={createParams?.metadata?.voice || "-"}
          onChange={(m) =>
            setCreateParams({
              ...createParams,
              metadata: {
                ...(createParams?.metadata || {}),
                voice: m,
              },
            })
          }
        >
          <div className="relative mt-1">
            <Listbox.Button
              className={
                "text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded outline-2 hover:outline hover:outline-[#0066FF]"
              }
            >
              <div className={"flex items-center justify-between"}>
                {/* @ts-ignore */}
                {createParams?.metadata?.voice || "-"}
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
        <div className={"text-xl font-medium"}>Model*</div>
        <Listbox
          value={createParams.model}
          onChange={(m) => setCreateParams({ ...createParams, model: m })}
        >
          <div className="relative mt-1">
            <Listbox.Button
              className={
                "text-sm border max-w-[360px] w-full h-7 px-2 py-1 text-start rounded outline-2 hover:outline hover:outline-[#0066FF]"
              }
            >
              <div className={"flex items-center justify-between"}>
                {createParams?.model || "-"}
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
  );
};

export default CreateForm;
