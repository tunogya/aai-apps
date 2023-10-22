import React from "react";
import Eye1 from "@/app/speak/Eye1";
import Eye2 from "@/app/speak/Eye2";
import Eye3 from "@/app/speak/Eye3";
import Eye4 from "@/app/speak/Eye4";
import Eye5 from "@/app/speak/Eye5";
import Eye7 from "@/app/speak/Eye7";
import Eye8 from "@/app/speak/Eye8";
import Eye6 from "@/app/speak/Eye6";

export default async function CSRPage() {
  return (
    <div
      className={
        "px-4 md:px-10 md:pt-4 absolute h-[calc(100vh-60px)] w-full overflow-y-auto pb-40 space-y-20 flex items-center justify-center"
      }
    >
      <Eye1 />
      {/*<Eye2 />*/}
      {/*<Eye3 />*/}
      {/*<Eye4 />*/}
      {/*<Eye5 />*/}
      {/*<Eye6 />*/}
      {/*<Eye7 />*/}
      {/*<Eye8 />*/}
    </div>
  );
}
