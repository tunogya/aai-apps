"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import LogItem from "@/app/assistants/([id])/[id]/Logs/LogItem";

const CSRPage = () => {
  const params = useParams();
  const { data, isLoading } = useSWR(
    `/api/assistants/${params.id}/logs?limit=5`,
    (url) => fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"pt-4"}>
      <div className={"flex justify-between pb-3 border-b"}>
        <div className={"text-gray-800 font-semibold"}>Logs</div>
      </div>
      <div>
        {isLoading ? (
          <Skeleton count={5} className={"h-10"} />
        ) : data?.items?.length > 0 ? (
          data.items.map((item: any, index: number) => (
            <LogItem log={item} key={index} />
          ))
        ) : (
          <div className={"text-sm text-gray-400 h-10 flex items-center"}>
            No Logs
          </div>
        )}
      </div>
    </div>
  );
};

export default CSRPage;
