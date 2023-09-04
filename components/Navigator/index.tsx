import Image from "next/image";
import NavItemList from "./NavItemList";
import CompInfo from "@/components/Navigator/CompInfo";
import { getSession } from "@auth0/nextjs-auth0/edge";

export default async function Component() {
  // @ts-ignore
  const { user } = await getSession();

  return (
    <div
      className={
        "flex flex-col h-full w-[260px] min-w-[260px] bg-[#fafafa] text-gray-500 gap-6 relative border-r"
      }
    >
      <div
        className={"flex gap-2 mt-5 mx-3 p-2.5 group hover:bg-gray-200 rounded"}
      >
        <div
          className={
            "rounded-full bg-white border border-gray-200 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] overflow-hidden"
          }
        >
          {user?.picture && (
            <Image src={user?.picture!} height={32} width={32} alt={""} />
          )}
        </div>
        <div className={"w-full relative overflow-hidden"}>
          <div className={"text-sm font-medium mr-5 overflow-hidden truncate"}>
            {user?.email}
          </div>
          <div className={"text-xs"}>Estimated costs: $0.00</div>
          <a
            href={"/api/auth/logout"}
            className={
              "absolute top-0 right-0 hidden group-hover:block cursor-pointer"
            }
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </a>
        </div>
      </div>
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
