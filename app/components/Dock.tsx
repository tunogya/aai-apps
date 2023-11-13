import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export const runtime = "edge";

const Dock = () => {
  return (
    <div
      className={
        "absolute right-0 top-0 h-full w-10 border-l flex-col items-center justify-center space-y-4 shrink-0 bg-white z-10 hidden md:flex"
      }
    >
      <Link
        href={"/personas/create"}
        prefetch
        className={
          "h-8 w-8 rounded border flex items-center justify-center text-sm hover:shadow hover:bg-gray-100"
        }
      >
        <PlusIcon className={"w-4 h-4 stroke-2"} />
      </Link>
    </div>
  );
};

export default Dock;
