import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment, useState } from "react";

const Modal: FC<{
  assistantId: string;
  callback: () => void;
}> = ({ assistantId, callback }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [token, setToken] = useState("");

  const addTgBot = async () => {
    setStatus("loading");
    try {
      await fetch(`/api/assistants/${assistantId}/accounts`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UpdateExpression: `SET #telegram = :telegram`,
          ExpressionAttributeNames: {
            "#telegram": "telegram",
          },
          ExpressionAttributeValues: {
            ":telegram": {
              token: token,
              webhook: `https://app.abandon.ai/api/bot/${token}`,
            },
          },
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
        Add
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
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                  >
                    <div>Add Telegram Bot</div>
                  </Dialog.Title>

                  <div className={"space-y-4 h-fit mt-4"}>
                    <div className={"space-y-2 text-gray-800"}>
                      <div className={"font-medium"}>Token*</div>
                      <input
                        maxLength={256}
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder={"Enter a user friendly name."}
                        className={
                          "border text-sm overflow-x-scroll  w-full h-7 px-2 py-1 rounded focus:outline-[#0066FF]"
                        }
                      />
                    </div>
                  </div>
                  <div className={"mt-10 flex justify-end gap-2"}>
                    <button
                      onClick={addTgBot}
                      className={
                        "bg-[#0066FF] text-white rounded-lg px-3 py-1.5 text-sm disabled:opacity-50"
                      }
                    >
                      {status === "loading" && "Adding..."}
                      {status === "idle" && "Add"}
                      {status === "error" && "Error"}
                      {status === "success" && "Added!"}
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
