"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";

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
          <Skeleton count={3} className={"h-10"} />
        ) : data?.items?.length > 0 ? (
          data.items.map((item: any) => (
            <div
              key={item.SK}
              className={
                "text-sm text-gray-500 flex justify-between font-light h-10 hover:bg-gray-50 items-center px-1 cursor-pointer"
              }
            >
              <div>New thread: {item.SK.split("#")[1]}</div>
              <div>{new Date(item.updated * 1000).toLocaleString()}</div>
            </div>
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
