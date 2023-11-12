import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const CreateForm = dynamic(() => import("@/app/personas/create/CreateForm"), {
  ssr: false,
});
const CreatePreview = dynamic(
  () => import("@/app/personas/create/CreatePreview"),
  {
    ssr: false,
  },
);
const ActionButtonGroup = dynamic(
  () => import("@/app/personas/create/ActionButtonGroup"),
  {
    ssr: false,
  },
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
          </Link>
          <div className={"pl-5 text-gray-800 font-medium"}>
            Create new Persona
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
          <CreatePreview />
        </div>
      </div>
    </div>
  );
}
