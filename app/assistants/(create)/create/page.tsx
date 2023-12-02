"use client";
import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";

const Help = dynamic(() => import("@/app/assistants/(create)/create/Help"), {
  loading: () => <Skeleton count={5} height={"28px"} />,
});
const CreateForm = dynamic(
  () => import("@/app/assistants/(create)/create/CreateForm"),
  {
    loading: () => <Skeleton count={5} height={"28px"} />,
  },
);

export default function CSRPage() {
  const router = useRouter();
  const [createParams, setCreateParams] = useState<any>({
    name: "",
    description: "",
    instructions: "",
    model: "gpt-4-1106-preview",
    metadata: {
      voice: "Alloy",
    },
  });
  const [status, setStatus] = useState("idle");

  const create = async () => {
    setStatus("loading");
    try {
      const result = await fetch(`/api/assistants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: createParams?.name?.trim() || undefined,
          description: createParams?.description?.trim() || undefined,
          instructions: createParams?.instructions?.trim() || undefined,
          model: createParams?.model?.toLowerCase() || undefined,
          metadata: createParams?.metadata || {},
        }),
      }).then((res) => res.json());
      setStatus("success");
      if (result?.success) {
        router.push("/assistants");
      }
    } catch (e) {
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }
  };

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
            href={"/assistants"}
            prefetch
            className={"px-3 pr-4 cursor-pointer"}
          >
            <XMarkIcon className={"w-4 h-4 stroke-2"} />
          </Link>
          <div className={"pl-5 text-gray-800 font-medium"}>
            Create an assistant
          </div>
        </div>
        <div className={"flex items-center gap-3"}>
          <button
            className={
              "px-2 py-1 rounded-lg text-gray-800 border cursor-pointer font-medium"
            }
            onClick={() => {
              router.back();
            }}
          >
            Cancel
          </button>
          <button
            disabled={
              !createParams?.name || !createParams?.model || status !== "idle"
            }
            onClick={create}
            className={
              "bg-[#0066FF] px-2 py-1 rounded-lg text-white disabled:cursor-auto cursor-pointer font-medium disabled:opacity-50"
            }
          >
            {status === "success" && "Created!"}
            {status === "error" && "Error!"}
            {status === "idle" && "Create"}
            {status === "loading" && "Creating..."}
          </button>
        </div>
      </div>
      <div className={"flex h-[calc(100vh-68px)]"}>
        <div
          className={"w-1/2 min-w-[440px] flex justify-center overflow-y-auto"}
        >
          <CreateForm
            createParams={createParams}
            setCreateParams={setCreateParams}
          />
        </div>
        <div className={"w-1/2 bg-gray-100 p-10 overflow-y-auto"}>
          <Help />
        </div>
      </div>
    </div>
  );
}
