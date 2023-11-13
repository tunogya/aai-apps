"use client";
import { Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";

const SettingPopover = () => {
  return (
    <Popover className="relative">
      <Popover.Button
        className={
          "hover:bg-gray-100 p-2 rounded-full text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        }
      >
        <Cog8ToothIcon className={"w-5 h-5 stroke-2"} />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel
          className={
            "absolute mt-1 right-0 w-40 rounded border shadow py-2 z-50 bg-white"
          }
        >
          <a href={"/api/auth/logout"}>
            <div
              className={
                "hover:bg-gray-100 w-full py-2 px-4 font-semibold text-start text-red-500"
              }
            >
              Logout
            </div>
          </a>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default SettingPopover;
