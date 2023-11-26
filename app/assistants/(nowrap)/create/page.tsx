"use client";
import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { nanoid } from "ai";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { FORM } from "@/app/assistants/(nowrap)/create/Form";

const Help = dynamic(() => import("@/app/assistants/(nowrap)/create/Help"), {
  loading: () => <Skeleton count={5} height={"28px"} />,
});
const Form = dynamic(() => import("@/app/assistants/(nowrap)/create/Form"), {
  loading: () => <Skeleton count={5} height={"28px"} />,
});

export default function CSRPage() {
  const router = useRouter();
  const [form, setForm] = useState<FORM>({
    name: "",
    instructions: "",
    voice: "",
    model: "",
  });

  const create = async () => {
    const assistant_id = nanoid();

    try {
      const result = await fetch(`/api/assistants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          assistant_id,
        }),
      }).then((res) => res.json());
      if (result?.success) {
        router.push("/assistants");
      }
    } catch (e) {
      router.back();
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
            onClick={create}
            className={
              "bg-[#0066FF] px-2 py-1 rounded-lg text-white disabled:cursor-auto cursor-pointer font-medium"
            }
          >
            Create
          </button>
        </div>
      </div>
      <div className={"flex h-[calc(100vh-68px)]"}>
        <div
          className={"w-1/2 min-w-[440px] flex justify-center overflow-y-auto"}
        >
          <Form form={form} setForm={setForm} />
        </div>
        <div className={"w-1/2 bg-gray-100 p-10"}>
          <Help />
        </div>
      </div>
    </div>
  );
}
