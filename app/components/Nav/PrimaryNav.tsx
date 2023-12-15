import Account from "@/app/components/Account";
import CoreNav from "@/app/components/Nav/CoreNav";

export const runtime = "edge";

const PrimaryNav = () => {
  return (
    <div
      className={
        "shrink-0 h-full border-r px-0 pr-4 2xl:pl-8 w-[220px] 2xl:w-[260px] min-w-[220px] max-w-[260px] py-4 space-y-10 relative hidden md:block"
      }
    >
      <Account />
      <CoreNav />
      <div
        className={
          "absolute bottom-0 left-0 pb-8 pt-4 pl-6 2xl:pl-10 bg-white select-none"
        }
      >
        <div className={"text-xs text-gray-800"}>
          ©{new Date().getFullYear()} Abandon Inc.,
        </div>
        <div className={"text-xs text-gray-500 font-light"}>
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
  );
};

export default PrimaryNav;
