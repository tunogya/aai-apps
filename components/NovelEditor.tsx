"use client";

import { Editor } from "novel";
import { useState } from "react";

export default function NovelEditor() {
  const [saveStatus, setSaveStatus] = useState("Saved");

  return (
    <div className="relative h-full w-full flex justify-center">
      <div className="absolute right-10 top-0 z-10 mb-5 rounded-lg bg-gray-50 px-2 py-1 text-sm text-gray-400">
        {saveStatus}
      </div>
      <Editor
        className={
          "relative h-full w-full overflow-y-auto p-4 md:mb-[calc(20vh)] max-w-3xl mt-10"
        }
        onUpdate={() => {
          setSaveStatus("Unsaved");
        }}
        defaultValue={"Hello!"}
        onDebouncedUpdate={() => {
          setSaveStatus("Saving...");
          // Simulate a delay in saving.
          setTimeout(() => {
            setSaveStatus("Saved");
          }, 500);
        }}
      />
    </div>
  );
}
