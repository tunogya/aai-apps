import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import CreateForm from "@/app/assistants/create/Form/CreateForm";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Binding = dynamic(() => import("@/app/assistants/create/Binding"));
const ActionButtonGroup = dynamic(
  () => import("@/app/assistants/create/ActionButtonGroup"),
);

export const runtime = "edge";

export default function SSRPage() {
  return (
    <div className={"h-full w-full"}>
      <div
        className={
          "py-5 pl-2 pr-5 text-sm flex items-center justify-between border-b h-[68px] w-full"
        }
      >
        <div
          className={"flex items-center divide-x divide-gray-300 text-gray-800"}
        >
          <Link
            href={"/personas"}
            prefetch
            className={"px-3 pr-4 cursor-pointer"}
          >
            <XMarkIcon className={"w-4 h-4 stroke-2"} />
          </Link>
          <div className={"pl-5 text-gray-800 font-medium"}>
            Create an assistant
          </div>
        </div>
        <ActionButtonGroup />
      </div>
      <div className={"flex h-[calc(100vh-68px)]"}>
        <div
          className={"w-1/2 min-w-[440px] flex justify-center overflow-y-auto"}
        >
          <CreateForm />
        </div>
        <div className={"w-1/2 bg-gray-100 p-10"}>
          <Binding />
        </div>
      </div>
    </div>
  );
}
