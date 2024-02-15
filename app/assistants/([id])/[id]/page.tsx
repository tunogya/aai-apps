"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useSessionStorage } from "@uidotdev/usehooks";

const Detail = dynamic(() => import("@/app/assistants/([id])/[id]/Detail"));
const Overview = dynamic(() => import("@/app/assistants/([id])/[id]/Overview"));
const MorePopover = dynamic(
  () => import("@/app/assistants/([id])/[id]/Overview/MorePopover"),
);

const CSRPage = () => {
  const params = useParams();
  const [type, setType] = useSessionStorage("assistants:type", "overview");

  return (
    <div
      className={
        "flex px-4 md:px-10 md:pt-2 absolute h-[calc(100vh-60px)] w-full space-x-8 overflow-y-auto"
      }
    >
      <div className={"space-y-2 py-1 px-1 text-gray-800 w-80 pb-10"}>
        <Link
          href={"/assistants"}
          prefetch
          className={"text-sm font-semibold text-[#0066FF]"}
        >
          Assistants
        </Link>
        <Detail />
      </div>
      <div className={"space-y-6 flex-1 py-1 text-gray-800 pb-10"}>
        <div className={"border-b flex justify-between"}>
          <div className={"flex gap-8"}>
            <button
              onClick={() => {
                setType("overview");
                // router.push(`/assistants/asst_KDToprTbQw510YzF3ICpfH3q?type=overview`);
                // searchParams;
              }}
              className={`font-medium border-b-2 ${
                type === "overview"
                  ? "text-[#0066FF] border-[#0066FF]"
                  : "border-transparent text-gray-500"
              } pb-3`}
            >
              Overview
            </button>
          </div>
          <MorePopover />
        </div>
        {type === "overview" && <Overview assistantId={params?.id as string} />}
      </div>
    </div>
  );
};

export default CSRPage;
