import React from "react";
import dynamic from "next/dynamic";

const NameInput = dynamic(() => import("./NameInput"));
const PersonalityTypeInput = dynamic(() => import("./PersonalityTypeInput"));
const HobbiesInput = dynamic(() => import("./HobbiesInput"));
const ValuesInput = dynamic(() => import("./ValuesInput"));
const CommunicationStyleSelect = dynamic(
  () => import("./CommunicationStyleSelect"),
);
const ResponseStrategySelect = dynamic(
  () => import("./ResponseStrategySelect"),
);
const SocialPreferencesSelect = dynamic(
  () => import("./SocialPreferencesSelect"),
);
const VoiceOptionSelect = dynamic(() => import("./VoiceOptionSelect"));

export const runtime = "edge";

const CreateForm = () => {
  return (
    <div className={"p-10 min-w-[360px] w-[608px] space-y-8 h-fit pb-40"}>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Name</div>
        <NameInput />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Personality type</div>
        <PersonalityTypeInput />
        <div className={"text-sm text-gray-400"}>
          You can change the order of four words to adjust the priority of
          cognitive functions.
        </div>
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Voice option</div>
        <VoiceOptionSelect />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Hobbies and interests</div>
        <HobbiesInput />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Values and beliefs</div>
        <ValuesInput />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Communication style</div>
        <CommunicationStyleSelect />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Response strategy</div>
        <ResponseStrategySelect />
      </div>
      <div className={"space-y-4 text-gray-800"}>
        <div className={"text-xl font-medium"}>Social preferences</div>
        <SocialPreferencesSelect />
      </div>
    </div>
  );
};

export default CreateForm;
