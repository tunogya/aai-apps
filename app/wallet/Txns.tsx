"use client";
import React from "react";
import useSWR from "swr";
import moment from "moment/moment";

const Txns = () => {
  const { data, isLoading } = useSWR(
    "/api/customer/balanceTransactions",
    (url) => fetch(url).then((res) => res.json()),
  );

  if (isLoading) {
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
                <div className={"text-sm text-[#A7A7A7]"}>
                  {moment(item.created * 1000)
                    .startOf("second")
                    .fromNow()}
                </div>
              </div>
              <div className={"text-end"}>
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
        <div className={"text-white text-xs"}>404</div>
      )}
    </div>
  );
};

export default Txns;
