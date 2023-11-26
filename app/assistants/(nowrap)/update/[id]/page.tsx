"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import useSWRImmutable from "swr/immutable";

const Help = dynamic(() => import("@/app/assistants/(nowrap)/create/Help"), {
  loading: () => <Skeleton count={5} height={"28px"} />,
});
const UpdateForm = dynamic(
  () => import("@/app/assistants/(nowrap)/update/[id]/UpdateForm"),
  {
    loading: () => <Skeleton count={5} height={"28px"} />,
  },
);

export default function CSRPage() {
  const router = useRouter();
  const params = useParams();
  const [updateParams, setUpdateParams] = useState<any>({
    name: "",
    description: "",
    instructions: "",
    model: "",
    metadata: {
      voice: "",
    },
  });
  const [status, setStatus] = useState("idle");

  const update = async () => {
    setStatus("loading");
    try {
      const result = await fetch(`/api/assistants/${params?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: updateParams?.name?.trim(),
          description: updateParams?.description?.trim() || undefined,
          instructions: updateParams?.instructions?.trim() || undefined,
          model: updateParams?.model?.toLowerCase() || "gpt-4-1106-preview",
          metadata: updateParams?.metadata || {},
        }),
      }).then((res) => res.json());
      setStatus("success");
      if (result?.updated) {
        router.push(`/assistants/${params?.id}`);
      }
    } catch (e) {
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }
  };

  const { data, isLoading } = useSWRImmutable(
    params?.id ? `/api/assistants/${params.id}` : undefined,
    (url) => fetch(url).then((res) => res.json()),
  );

  useEffect(() => {
    if (data) {
      setUpdateParams({
        name: data?.item?.name || "",
        description: data?.item?.description || "",
        instructions: data?.item?.instructions || "",
        model: data?.item?.model || "gpt-4-1106-preview",
        metadata: data?.item?.metadata || {},
      });
    }
  }, [data]);

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
            Update an assistant
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
              !updateParams?.name || !updateParams?.model || status !== "idle"
            }
            onClick={update}
            className={
              "bg-[#0066FF] px-2 py-1 rounded-lg text-white disabled:cursor-auto cursor-pointer font-medium disabled:opacity-50"
            }
          >
            {status === "success" && "Updated!"}
            {status === "error" && "Error!"}
            {status === "idle" && "Update"}
            {status === "loading" && "Updating..."}
          </button>
        </div>
      </div>
      <div className={"flex h-[calc(100vh-68px)]"}>
        <div
          className={"w-1/2 min-w-[440px] flex justify-center overflow-y-auto"}
        >
          <UpdateForm
            updateParams={updateParams}
            setUpdateParams={setUpdateParams}
          />
        </div>
        <div className={"w-1/2 bg-gray-100 p-10 overflow-y-auto"}>
          <Help />
        </div>
      </div>
    </div>
  );
}
