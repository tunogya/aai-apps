"use client";
import React from "react";
import useSWR from "swr";
import moment from "moment/moment";

const Transactions = () => {
  const { data: customer } = useSWR("/api/customer", (url) =>
    fetch(url).then((res) => res.json()),
  );
  const { data, isLoading } = useSWR(
    customer?.id ? `/api/customer/${customer.id}/txs` : undefined,
    (url) => fetch(url).then((res) => res.json()),
  );

  if (!customer || isLoading) {
    return <div className={"text-[#A7A7A7] text-xs"}>loading...</div>;
  }

  return (
    <div>
      {data ? (
        <div className={"flex flex-col"}>
          {data.map((item: any) => (
            <div
              key={item.id}
              className={
                "text-white flex flex-row justify-between items-center py-4"
              }
            >
              <div className={"flex flex-row items-center space-x-3"}>
                <div className={"p-3 bg-[#2c2c2c] rounded-full"}>
                  {item.amount < 0 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                      />
                    </svg>
                  )}
                </div>
                <div className={"flex flex-col justify-start gap-1"}>
                  {item.description && (
                    <div
                      className={
                        "text-sm text-[#FFFFFF] font-semibold line-clamp-2"
                      }
                    >
                      {item.description}
                    </div>
                  )}
                  <div className={"text-sm text-[#A7A7A7]"}>
                    {moment(item.created * 1000)
                      .startOf("second")
                      .fromNow()}
                  </div>
                </div>
              </div>
              <div className={"flex flex-col text-end gap-1 shrink-0"}>
                <div className={"font-semibold"}>
                  {(-1 * item.amount) / 100} AAI
                </div>
                <div className={"font-light text-sm text-[#A7A7A7]"}>
                  {(-1 * item.ending_balance) / 100} AAI
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={"text-white text-xs"}>No transactions.</div>
      )}
    </div>
  );
};

export default Transactions;
