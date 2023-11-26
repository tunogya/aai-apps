"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";

const CSRPage = () => {
  const params = useParams();
  const { data, isLoading } = useSWR(
    params?.id ? `/api/assistants/${params.id}` : undefined,
    (url) => fetch(url).then((res) => res.json()),
  );

  return (
    <div className={""}>
      <div className={"space-y-1"}>
        <div className={"text-3xl font-medium text-gray-800"}>
          {isLoading ? <Skeleton /> : data?.item.name || "Null"}
        </div>
        <div className={"text-gray-500"}>
          {isLoading ? <Skeleton /> : data?.item.model || "Null"}
        </div>
      </div>
      <div className={"space-y-3"}>
        <div className={"flex justify-between mt-16 pb-3 border-b"}>
          <div className={"text-gray-800 font-semibold"}>Detail</div>
          <Link
            prefetch
            href={`/assistants/update/${params?.id}`}
            className={
              "text-sm text-[#0066FF] font-medium disabled:cursor-auto disabled:opacity-50"
            }
          >
            Edit
          </Link>
        </div>
        <div>
          <div className={"text-sm text-gray-500"}>Assistant ID</div>
          <div className={"text-sm text-gray-600"}>
            {isLoading ? (
              <Skeleton />
            ) : (
              data?.item?.SK.replace("ASST#", "") || "Null"
            )}
          </div>
        </div>
        <div>
          <div className={"text-sm text-gray-500"}>Description</div>
          <div className={"text-sm text-gray-600 break-words"}>
            {isLoading ? (
              <Skeleton count={3} />
            ) : (
              data?.item?.description || "Null"
            )}
          </div>
        </div>
        <div>
          <div className={"text-sm text-gray-500"}>Instructions</div>
          <div className={"text-sm text-gray-600 break-words"}>
            {isLoading ? (
              <Skeleton count={3} />
            ) : (
              data?.item?.instructions || "Null"
            )}
          </div>
        </div>
        <div>
          <div className={"text-sm text-gray-500"}>Voice</div>
          <div className={"text-sm text-gray-600"}>
            {isLoading ? <Skeleton /> : data?.item?.metadata?.voice || "Null"}
          </div>
        </div>
        <div>
          <div className={"text-sm text-gray-500"}>Create at</div>
          <div className={"text-sm text-gray-600"}>
            {isLoading ? (
              <Skeleton />
            ) : data?.item?.created_at ? (
              new Date(data.item.created_at * 1000).toLocaleString()
            ) : (
              "Null"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRPage;
