import RecentNav from "@/components/Nav/RecentNav";
import { FC } from "react";
import Account from "@/components/Account";
import CoreNav from "@/components/Nav/CoreNav";
import Image from "next/image";

const PrimaryNav: FC<{
  active: string;
}> = (props) => {
  return (
    <div
      className={
        "w-full max-w-[260px] shrink-0 h-full border-r px-0 lg:px-2 xl:px-4 2xl:px-8 py-4 space-y-10 relative"
      }
    >
      <Account />
      <CoreNav />
      <RecentNav />
      <div
        className={
          "absolute bottom-0 left-0 pb-8 pt-4 pl-4 lg:pl-6 xl:pl-8 flex items-center gap-3 bg-white"
        }
      >
        <Image src={"/favicon.svg"} alt={""} height={36} width={36} />
        <div>
          <div className={"text-xs text-stone-800"}>
            ©{new Date().getFullYear()} Abandon Inc.,
          </div>
          <div className={"text-xs text-stone-500 font-light"}>
            Powered by{" "}
            <a
              href={"https://openai.com"}
              target={"_blank"}
              className={"underline"}
            >
              OpenAI
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimaryNav;
