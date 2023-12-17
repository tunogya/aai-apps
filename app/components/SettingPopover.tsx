"use client";
import { Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { PowerIcon } from "@heroicons/react/24/outline";

const SettingPopover = () => {
  return (
    <Popover className="relative">
      <Popover.Button
        className={
          "hover:bg-gray-100 p-2 rounded-full text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        }
      >
        <Cog8ToothIcon className={"w-5 h-5 stroke-1.5"} />
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
            "absolute mt-1 right-0 w-60 rounded border shadow z-50 bg-white p-2"
          }
        >
          <a href={"/api/auth/logout"}>
            <div
              className={
                "hover:bg-gray-100 w-full py-1 px-2 font-semibold text-start flex items-center space-x-2 rounded text-[#0066FF] hover:text-gray-800"
              }
            >
              <PowerIcon className={"w-4 h-4 stroke-1.5"} />
              <div>Logout</div>
            </div>
          </a>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default SettingPopover;
