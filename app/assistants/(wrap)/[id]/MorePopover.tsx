"use client";
import { Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import {
  EllipsisHorizontalIcon,
  PowerIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const MorePopover = () => {
  return (
    <Popover className="relative">
      <Popover.Button
        className={
          "px-2 py-1 border rounded-lg hover:bg-gray-100 p-2 text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        }
      >
        <EllipsisHorizontalIcon className={"w-4 h-4"} />
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
          <button
            className={
              "hover:bg-gray-100 w-full py-2 px-4 font-semibold text-start flex items-center space-x-2 text-sm"
            }
          >
            <TrashIcon className={"w-4 h-4 stroke-2"} />
            <div>Delete</div>
          </button>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default MorePopover;
