"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";

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
          data.items.map((item: any) => (
            <Link
              href={`/threads/${item.SK.split("#")[1]}`}
              prefetch={true}
              key={item.SK}
              className={
                "text-sm text-gray-500 flex justify-between h-10 hover:bg-gray-50 items-center px-1 cursor-pointer border-b"
              }
            >
              <div>Run on {item.SK.split("#")[1]}</div>
              <div className={"text-[13px]"}>
                {new Date(item.updated * 1000).toLocaleString()}
              </div>
            </Link>
          ))
        ) : (
          <div className={"text-sm text-gray-500 h-10 flex items-center"}>
            No Logs
          </div>
        )}
      </div>
    </div>
  );
};

export default CSRPage;
