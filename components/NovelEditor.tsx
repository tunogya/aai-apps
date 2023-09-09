"use client";

import { Editor } from "novel";
import { useState } from "react";

export default function NovelEditor() {
  const [saveStatus, setSaveStatus] = useState("Saved");

  return (
    <div className="relative h-full w-full">
      <div className="absolute right-4 top-4 z-10 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
        {saveStatus}
      </div>
      <Editor
        className={"h-full w-full overflow-y-auto p-4"}
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
