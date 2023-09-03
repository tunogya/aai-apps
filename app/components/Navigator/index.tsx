import Image from "next/image";
import NavItemList from "./NavItemList";
import UserInfo from "@/app/components/Navigator/UserInfo";
import CompInfo from "@/app/components/Navigator/CompInfo";

export default function Component() {
  return (
    <div
      className={
        "flex flex-col h-full w-[260px] min-w-[260px] bg-gray-100 text-gray-500 gap-6 relative"
      }
    >
      <UserInfo />
      <NavItemList />
      <div className={"absolute bottom-0 w-full pl-6 pb-6 pt-6 pr-4"}>
        <div className={"flex items-center w-full gap-0.5"}>
          <Image src={"/favicon.svg"} alt={""} width={"32"} height={"32"} />
          <div className={"text-xs ml-3"}>|</div>
          <CompInfo />
        </div>
      </div>
    </div>
  );
}
