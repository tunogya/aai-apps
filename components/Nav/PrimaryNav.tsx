import RecentNav from "@/components/Nav/RecentNav";
import { FC } from "react";
import Account from "@/components/Account";
import CoreNav from "@/components/Nav/CoreNav";

const PrimaryNav: FC<{
  active: string;
}> = (props) => {
  return (
    <div
      className={
        "w-full max-w-[260px] shrink-0 h-full border-r px-8 py-4 space-y-10"
      }
    >
      <Account />
      <CoreNav active={props.active} />
      <RecentNav />
    </div>
  );
};

export default PrimaryNav;
