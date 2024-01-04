"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";

const CSRPage = () => {
  const params = useParams();
  const { data, isLoading } = useSWR(
    `/api/assistants/${params.id}/events?limit=5`,
    (url) => fetch(url).then((res) => res.json()),
  );

  const showLog = (type: string) => {
    switch (type) {
      case "assistant.put":
        return "Update assistant's detail";
      case "assistant.post":
        return "Create new assistant";
      default:
        return "N/A";
    }
  };

  return (
    <div className={"pt-4"}>
      <div className={"flex justify-between pb-3 border-b"}>
        <div className={"text-gray-800 font-semibold"}>Events</div>
      </div>
      <div>
        {isLoading ? (
          <Skeleton count={5} className={"h-10"} />
        ) : data?.items?.length > 0 ? (
          data.items.map((item: any) => (
            <div
              key={item.SK}
              className={
                "text-sm text-gray-600 flex justify-between h-10 hover:bg-gray-50 items-center px-1 cursor-pointer border-b"
              }
            >
              <div>{showLog(item.type)}</div>
              <div className={"text-[13px] text-gray-500"}>
                {item?.updated
                  ? new Date(item?.updated * 1000)?.toLocaleString()
                  : "N/A"}
              </div>
            </div>
          ))
        ) : (
          <div className={"text-sm text-gray-400 h-10 flex items-center"}>
            No Events
          </div>
        )}
      </div>
    </div>
  );
};

export default CSRPage;
