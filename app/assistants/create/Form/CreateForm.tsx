import React from "react";
import dynamic from "next/dynamic";

const NameInput = dynamic(() => import("./NameInput"));
const InstructionsInput = dynamic(() => import("./InstructionsInput"));
const VoiceOptionSelect = dynamic(() => import("./VoiceOptionSelect"));
const ModelOptionSelect = dynamic(() => import("./ModelOptionSelect"));

export const runtime = "edge";

const CreateForm = () => {
  return (
    <div className={"p-10 min-w-[360px] w-[608px] space-y-8 h-fit pb-40"}>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Name</div>
        <NameInput />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Instructions</div>
        <InstructionsInput />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Voice</div>
        <VoiceOptionSelect />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Model</div>
        <ModelOptionSelect />
      </div>
    </div>
  );
};

export default CreateForm;
