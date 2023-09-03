"use client";
import React, { Fragment, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, Transition, RadioGroup } from "@headlessui/react";

const models = [
  {
    id: 1,
    name: "gpt-3.5-turbo",
    maxToken: 4097,
    trainingData: "Up to Sep 2021",
    price: {
      input: 0.0015,
      output: 0.002,
    },
    rateLimit: {
      tpm: 90000,
      rpm: 3500,
    },
  },
  {
    id: 2,
    name: "gpt-3.5-turbo-16k",
    maxToken: 16385,
    trainingData: "Up to Sep 2021",
    price: {
      input: 0.003,
      output: 0.004,
    },
    rateLimit: {
      tpm: 180000,
      rpm: 3500,
    },
  },
  {
    id: 3,
    name: "gpt-4",
    maxToken: 8192,
    trainingData: "Up to Sep 2021",
    price: {
      input: 0.03,
      output: 0.06,
    },
  },
  {
    id: 4,
    name: "gpt-4-32k",
    maxToken: 32768,
    trainingData: "Up to Sep 2021",
    price: {
      input: 0.06,
      output: 0.12,
    },
  },
];

export const AddDialog = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [model, setModel] = useState(models[0]);
  const isOpen = searchParams.get("dialog") === "add";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={router.back}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-5"
                >
                  Create Persona
                </Dialog.Title>
                <div className="mt-2 flex flex-col gap-2 items-center">
                  <input
                    placeholder={"name of persona"}
                    className={"border w-full p-2"}
                  />
                  <RadioGroup
                    value={model}
                    onChange={setModel}
                    className={"w-full"}
                  >
                    <div className="space-y-2">
                      {models.map((model) => (
                        <RadioGroup.Option
                          key={model.id}
                          value={model}
                          defaultValue={0}
                          className={({ active, checked }) =>
                            `${
                              checked ? "bg-blue-400 text-white" : "bg-white"
                            } relative flex cursor-pointer rounded px-3 py-2 border focus:outline-none`
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <div className="flex w-full items-center justify-between">
                                <div className="flex items-center">
                                  <div className="text-sm">
                                    <RadioGroup.Label
                                      as="p"
                                      className={`font-medium`}
                                    >
                                      {model.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description
                                      as="span"
                                      className={`inline text-xs`}
                                    >
                                      <span>
                                        Input: ${model.price.input} / 1K tokens
                                      </span>
                                      <br />
                                      <span>
                                        Output: ${model.price.output} / 1K
                                        tokens
                                      </span>
                                    </RadioGroup.Description>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                  <div
                    className={"w-full p-2 text-xs font-semibold text-center"}
                  >
                    EVERY PERSONA HAS A $0.5 MINIMUM COST PER MONTH!
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={router.back}
                    className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Create
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
