"use client";

import { Editor } from "novel";
import { useState } from "react";

export default function NovelEditor() {
  const [saveStatus, setSaveStatus] = useState("Saved");

  return (
    <div className="relative">
      <div className="absolute right-0 top-0 z-10 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
        {saveStatus}
      </div>
      <Editor
        className={
          "relative min-h-[500px] w-full border-stone-200 bg-white sm:mb-[calc(20vh)]"
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
