import { Dialog, Listbox, Transition } from "@headlessui/react";
import React, { FC, Fragment, useState } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";

const voice_options = ["Alloy", "Echo", "Fable", "Onyx", "Nova", "Shimmer"];

const model_options = [
  "gpt-4-1106-preview",
  "gpt-4",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo",
];

const Modal: FC<{
  assistantId: string;
  item: {
    name: string;
    description: string;
    instructions: string;
    model: string;
    metadata: {
      voice: string;
    };
  };
  callback: () => void;
}> = ({ item, assistantId, callback }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [updateParams, setUpdateParams] = useState<{
    name: string;
    description: string;
    instructions: string;
    model: string;
    metadata: {
      voice: string;
    };
  }>(item);

  const update = async () => {
    setStatus("loading");
    try {
      const result = await fetch(`/api/assistants/${assistantId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: updateParams?.name?.trim(),
          description: updateParams?.description?.trim() || undefined,
          instructions: updateParams?.instructions?.trim() || undefined,
          model: updateParams?.model?.toLowerCase() || "gpt-4-1106-preview",
          metadata: updateParams?.metadata || {},
        }),
      }).then((res) => res.json());
      setStatus("success");
      setIsOpen(false);
      callback();
    } catch (e) {
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          "text-sm text-[#0066FF] font-medium disabled:cursor-auto disabled:opacity-50"
        }
      >
        Edit
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Update assistant
                  </Dialog.Title>
                  <div className={"space-y-4 h-fit mt-4"}>
                    <div className={"space-y-2 text-gray-800"}>
                      <div className={"font-medium"}>Name*</div>
                      <input
                        maxLength={256}
                        value={updateParams?.name || ""}
                        onChange={(e) =>
                          setUpdateParams({
                            ...updateParams,
                            name: e.target.value,
                          })
                        }
                        placeholder={"Enter a user friendly name."}
                        className={
                          "border text-sm overflow-x-scroll  w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF]"
                        }
                      />
                    </div>
                    <div className={"space-y-2 text-gray-800"}>
                      <div className={"font-medium"}>Voice</div>
                      <Listbox
                        // @ts-ignore
                        value={updateParams?.metadata?.voice || "-"}
                        onChange={(m) =>
                          setUpdateParams({
                            ...updateParams,
                            metadata: {
                              ...(updateParams?.metadata || {}),
                              voice: m,
                            },
                          })
                        }
                      >
                        <div className="relative mt-1">
                          <Listbox.Button
                            className={
                              "text-sm border  w-full h-7 px-2 py-1 text-start rounded outline-2 hover:outline hover:outline-[#0066FF]"
                            }
                          >
                            <div
                              className={"flex items-center justify-between"}
                            >
                              {/* @ts-ignore */}
                              {updateParams?.metadata?.voice || "-"}
                              <ChevronUpDownIcon className={"w-4 h-4"} />
                            </div>
                          </Listbox.Button>
                          <Listbox.Options
                            className={
                              "absolute z-10 mt-1 max-h-60  w-full overflow-auto rounded bg-white shadow border py-1"
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
                    <div className={"space-y-2 text-gray-800"}>
                      <div className={"font-medium"}>Model*</div>
                      <Listbox
                        value={updateParams.model}
                        onChange={(m) =>
                          setUpdateParams({ ...updateParams, model: m })
                        }
                      >
                        <div className="relative mt-1">
                          <Listbox.Button
                            className={
                              "text-sm border  w-full h-7 px-2 py-1 text-start rounded outline-2 hover:outline hover:outline-[#0066FF]"
                            }
                          >
                            <div
                              className={"flex items-center justify-between"}
                            >
                              {updateParams?.model || "-"}
                              <ChevronUpDownIcon className={"w-4 h-4"} />
                            </div>
                          </Listbox.Button>
                          <Listbox.Options
                            className={
                              "absolute z-10 mt-1 max-h-60  w-full overflow-auto rounded bg-white shadow border py-1"
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
                    <div className={"space-y-2 text-gray-800"}>
                      <div className={"font-medium"}>Description</div>
                      <textarea
                        maxLength={512}
                        value={updateParams?.description || ""}
                        onChange={(e) =>
                          setUpdateParams({
                            ...updateParams,
                            description: e.target.value,
                          })
                        }
                        placeholder={"The description of the assistant."}
                        className={
                          "border text-sm overflow-x-scroll  w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF] min-h-[80px] max-h-[240px]"
                        }
                      />
                    </div>
                    <div className={"space-y-2 text-gray-800"}>
                      <div className={"font-medium"}>Instructions</div>
                      <textarea
                        maxLength={32768}
                        value={updateParams?.instructions || ""}
                        onChange={(e) =>
                          setUpdateParams({
                            ...updateParams,
                            instructions: e.target.value,
                          })
                        }
                        placeholder={"You are a helpful assistant."}
                        className={
                          "border text-sm overflow-x-scroll  w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF] min-h-[80px] max-h-[240px]"
                        }
                      />
                    </div>
                  </div>
                  <div className={"mt-10 flex justify-end gap-2"}>
                    <button
                      onClick={() => setIsOpen(false)}
                      className={
                        "text-gray-400 hover:text-gray-800 rounded px-3 py-1.5 text-sm"
                      }
                    >
                      Cancel
                    </button>
                    <button
                      onClick={update}
                      disabled={
                        status !== "idle" ||
                        !updateParams.name ||
                        !updateParams.model
                      }
                      className={
                        "bg-[#0066FF] text-white rounded-lg px-3 py-1.5 text-sm disabled:opacity-50"
                      }
                    >
                      {status === "loading" && "Updating"}
                      {status === "idle" && "Update"}
                      {status === "error" && "Error"}
                      {status === "success" && "Updated!"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
