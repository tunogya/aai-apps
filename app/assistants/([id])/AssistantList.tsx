"use client";

import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { FC } from "react";
import useSWR from "swr";

const AssistantList = () => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.nextCursor) return null;
    if (pageIndex === 0) return `/api/assistants?limit=20`;
    return `/api/assistants?cursor=${previousPageData.nextCursor}&limit=20`;
  };
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, (url) =>
    fetch(url).then((res) => res.json()),
  );

  if (data?.[0]?.count === 0) {
    return (
      <div className={"flex flex-col items-center justify-center flex-1 gap-2"}>
        <RocketLaunchIcon className={"w-5 h-5"} />
        <div className={"text-gray-800 font-medium"}>Create an assistant</div>
        <Link href={"/assistants/create"} prefetch>
          <div
            className={
              "bg-[#0066FF] text-white px-2 py-1 rounded-lg font-medium text-sm"
            }
          >
            + Create
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className={"w-full h-full"}>
      <div className={"gap-4 flex flex-col"}>
        <table className={"table-auto w-full"}>
          <thead className={"border-y"}>
            <tr className={"text-xs text-gray-700"}>
              <th className={"py-2 pr-6 text-start pl-2"}>Name</th>
              <th className={"py-2 pr-6 text-start"}>Description</th>
              <th className={"py-2 pr-6 text-start"}>Instructions</th>
              <th className={"py-2 pr-6 text-start"}>Voice</th>
              <th className={"py-2 pr-6 text-start"}>Model</th>
              <th className={"py-2 pr-6 text-start"}>Created</th>
            </tr>
          </thead>
          <tbody>
            {data?.[size - 1]?.items
              ?.sort((a: any, b: any) => a.created_at - b.created_at)
              ?.map((item: any, index: number) => (
                <TableRow id={item.id} key={index} />
              ))}
          </tbody>
        </table>
        <div className={"flex justify-between"}>
          <div className={"text-sm text-gray-700"}>
            {data?.[size - 1]?.count || 0} item
            {data?.[size - 1]?.count > 1 ? "s" : ""}
          </div>
          <div className={"flex space-x-2"}>
            <button
              disabled={size <= 1}
              className={
                "text-xs text-gray-700 disabled:text-gray-500 bg-white border px-2 py-1 rounded-lg disabled:cursor-auto"
              }
              onClick={async () => {
                if (size <= 1) {
                  return;
                }
                await setSize(size - 1);
              }}
            >
              Previous
            </button>
            <button
              disabled={data?.[size - 1]?.count !== 20}
              onClick={async () => {
                if (data?.[size - 1]?.count !== 20) {
                  return;
                }
                await setSize(size + 1);
              }}
              className={
                "text-xs text-gray-700 disabled:text-gray-500 bg-white border px-2 py-1 rounded-lg disabled:cursor-auto"
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableRow: FC<{
  id: string;
}> = ({ id }) => {
  const router = useRouter();
  const { data, isLoading } = useSWR(
    id ? `/api/assistants/${id}` : undefined,
    (url: string) => fetch(url).then((res) => res.json()),
  );

  return (
    <tr
      onClick={() => {
        router.push(`/assistants/${id}`);
      }}
      className={
        "border-b text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
      }
    >
      <td
        className={
          "py-2 pr-6 pl-2 text-gray-700 font-semibold truncate max-w-[240px]"
        }
      >
        {isLoading ? <Skeleton /> : data?.item?.name}
      </td>
      <td className={"py-2 pr-6 truncate max-w-[240px]"}>
        {isLoading ? <Skeleton /> : data?.item?.description}
      </td>
      <td className={"py-2 pr-6 truncate max-w-[240px]"}>
        {isLoading ? <Skeleton /> : data?.item?.instructions}
      </td>
      <td className={"py-2 pr-6 truncate max-w-[240px]"}>
        {isLoading ? <Skeleton /> : data?.item?.metadata?.voice || "-"}
      </td>
      <td className={"py-2 pr-6 truncate max-w-[240px]"}>
        {isLoading ? <Skeleton /> : data?.item?.model}
      </td>
      <td className={"py-2 pr-6 truncate max-w-[240px]"}>
        {isLoading ? (
          <Skeleton />
        ) : (
          new Date(data?.item?.created_at * 1000).toLocaleDateString()
        )}
      </td>
    </tr>
  );
};

export default AssistantList;
