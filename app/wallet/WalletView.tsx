import { getSession } from "@auth0/nextjs-auth0/edge";
import React from "react";
import BalanceCard from "@/app/wallet/BalanceCard";
import Transactions from "@/app/wallet/Transactions";
import Link from "next/link";
import CheckoutButton from "@/app/components/CheckoutButton";

export const runtime = "edge";

const WalletView = async () => {
  // @ts-ignore
  const session = await getSession();

  return (
    <div className={"space-y-6"}>
      <div className={"flex flex-row justify-between items-center"}>
        <Link
          href={"/"}
          prefetch
          className={
            "text-white hover:bg-[#2c2c2c] p-3 rounded-full cursor-pointer"
          }
        >
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <div className={"flex flex-row items-center text-white space-x-1"}>
          <div className={"text-white font-semibold px-2 py-1"}>
            {session?.user?.email || "-"}
          </div>
          <Link
            href={"/api/auth/logout"}
            className={"text-[#A7A7A7] hover:text-white cursor-pointer"}
          >
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
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className={"flex flex-row text-white gap-4"}>
        <CheckoutButton
          price={process.env.NEXT_PUBLIC_AAI_CREDIT_PRICE!}
          title={"Buy Tripiz"}
          className={
            "px-3 py-1.5 bg-[#0066FF] rounded-lg text-sm font-semibold cursor-pointer flex flex-row items-center space-x-1"
          }
        />
        {/*<div className={"px-3 py-1.5 bg-[#2c2c2c] rounded-lg text-sm font-semibold cursor-pointer flex flex-row items-center space-x-1"}>*/}
        {/*  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"*/}
        {/*       stroke="currentColor" className="w-4 h-4">*/}
        {/*    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>*/}
        {/*  </svg>*/}
        {/*  <div>*/}
        {/*    Deposit*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div*/}
        {/*  className={"px-3 py-1.5 bg-[#2c2c2c] rounded-lg text-sm font-semibold cursor-pointer flex flex-row items-center space-x-1"}>*/}
        {/*  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"*/}
        {/*       stroke="currentColor" className="w-4 h-4">*/}
        {/*    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14"/>*/}
        {/*  </svg>*/}
        {/*  <div>*/}
        {/*    Withdraw*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
      <BalanceCard />
      <div className={""}>
        <div className={"text-white font-semibold text-2xl py-4"}>
          Transaction
        </div>
        <Transactions />
      </div>
    </div>
  );
};

export default WalletView;
