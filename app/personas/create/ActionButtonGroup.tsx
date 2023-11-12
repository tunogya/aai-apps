"use client";
import React from "react";

const ActionButtonGroup = () => {
  return (
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
  );
};

export default ActionButtonGroup;
