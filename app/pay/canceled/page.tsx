import Link from "next/link";
import { TypedInfo } from "@/app/pay/canceled/TypedInfo";
import { DepositButton } from "@/app/pay/canceled/DepositButton";

export const runtime = "edge";

export default async function SSRPage() {
  return (
    <div
      className={
        "h-full w-full flex flex-col items-center justify-center gap-4 select-none"
      }
    >
      <div className={"text-[120px]"}>😫</div>
      <div className={"text-3xl font-bold text-yellow-500"}>CANCELED</div>
      <TypedInfo />
      <Link
        href={"/dashboard"}
        className={
          "w-64 py-4 border rounded-full text-center bg-yellow-500 text-white font-bold mt-4"
        }
      >
        Back
      </Link>
      <DepositButton />
    </div>
  );
}
