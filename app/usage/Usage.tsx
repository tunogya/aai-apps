"use client";
import useSWR from "swr";
import { roundUp } from "@/utils/roundUp";
import moment from "moment";

const Usage = () => {
  const { data } = useSWR("/api/usage?limit=50", (url) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"w-full overflow-hidden"}>
      <table className="table-fixed w-full">
        <thead>
          <tr className={"text-xs text-gray-500 border-b"}>
            <th
              className={
                "text-start pt-2 pr-4 pb-2 overflow-x-hidden font-semibold"
              }
            >
              Model
            </th>
            <th
              className={
                "text-start pt-2 pr-4 pb-2 overflow-x-hidden font-semibold"
              }
            >
              Prompt tokens
            </th>
            <th
              className={
                "text-start pt-2 pr-4 pb-2 overflow-x-hidden font-semibold"
              }
            >
              Completion tokens
            </th>
            <th
              className={
                "text-start pt-2 pr-4 pb-2 overflow-x-hidden font-semibold"
              }
            >
              Total cost
            </th>
            <th
              className={
                "text-start pt-2 pr-4 pb-2 overflow-x-hidden font-semibold"
              }
            >
              Created
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.items &&
            data.items.map((item: any, index: number) => (
              <tr key={index} className={"text-xs text-gray-600 border-b"}>
                <td
                  className={
                    "font-semibold pt-2 pr-4 pb-2 overflow-x-hidden text-black"
                  }
                >
                  {item.model}
                </td>
                <td className={"pt-2 pr-4 pb-2 overflow-x-hidden "}>
                  {item.prompt_tokens}
                </td>
                <td className={"pt-2 pr-4 pb-2 overflow-x-hidden"}>
                  {item.completion_tokens}
                </td>
                <td className={"pt-2 pr-4 pb-2 overflow-x-hidden"}>
                  {roundUp(item.total_cost, 6)}
                </td>
                <td className={"pt-2 pr-4 pb-2 overflow-x-hidden"}>
                  {moment(item.created * 1000)
                    .startOf("hour")
                    .fromNow()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usage;
