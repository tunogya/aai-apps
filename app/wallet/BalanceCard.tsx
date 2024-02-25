"use client";
import React from "react";
import useSWR from "swr";

const BalanceCard = () => {
  const { data: customer } = useSWR("/api/customer", (url) =>
    fetch(url).then((res) => res.json()),
  );

  console.log(customer);

  return (
    <div
      className={
        "p-4 bg-[#2c2c2c] rounded-xl text-white font-semibold h-56 flex flex-col justify-between"
      }
    >
      <div className={"flex flex-row items-center space-x-3"}>
        <div className={"h-12 w-12"}>
          <svg
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M68 68V956H956V68H68ZM142 882V142H586V413.333L512 216H438L216 808H290L345.5 660H586V882H142ZM576.791 586H373.209L475 314.667L576.791 586Z"
              fill="white"
            />
          </svg>
        </div>
        <div className={"text-xl"}>AbandonAI</div>
      </div>
      <div className={"text-lg"}>
        {customer ? ((customer?.balance * -1) / 100).toFixed(2) : 0} AAI
      </div>
    </div>
  );
};

export default BalanceCard;
