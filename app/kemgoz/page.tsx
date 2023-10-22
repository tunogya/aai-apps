"use client";
import Eye1 from "@/app/kemgoz/Eye1";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

export default function CSRPage() {
  const router = useRouter();

  return (
    <>
      <button
        className={
          "absolute text-black top-4 right-4 z-50 p-2 bg-gray-500 hover:bg-gray-200 rounded-full"
        }
        onClick={() => {
          router.back();
        }}
      >
        <XMarkIcon className={"w-5 h-5"} />
      </button>
      <div
        className={
          "px-4 md:px-10 absolute h-full w-full overflow-y-auto pb-40 space-y-20 flex items-center justify-center bg-black z-10"
        }
      >
        <Eye1 />
        {/*<Eye2 />*/}
        {/*<Eye3 />*/}
        {/*<Eye4 />*/}
        {/*<Eye5 />*/}
        {/*<Eye6 />*/}
        {/*<Eye7 />*/}
        {/*<Eye8 />*/}
      </div>
    </>
  );
}
