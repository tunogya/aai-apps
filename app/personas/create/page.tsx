"use client";
import React from "react";

export default function CSRPage() {
  return (
    <div className={"h-full w-full"}>
      <div
        className={
          "py-5 pl-2 pr-5 text-sm flex items-center justify-between border-b h-[68px] w-full"
        }
      >
        <div className={"flex items-center divide-x divide-gray-200"}>
          <div className={"px-3 pr-4 cursor-pointer"}>
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
          </div>
          <div className={"pl-5"}>Create new persona</div>
        </div>
        <div className={"flex items-center"}>
          <button
            className={
              "bg-[#0066FF] px-2 py-1 rounded-lg text-white disabled:opacity-50"
            }
            disabled
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
