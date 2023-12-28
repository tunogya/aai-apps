"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const menu = [
  {
    path: `/chat`,
    name: "ChatGPT",
    prefetch: true,
    target: undefined,
  },
  {
    path: "/assistants",
    name: "Assistants",
    prefetch: true,
    target: undefined,
  },
  {
    path: "/billing",
    name: "Billing",
    prefetch: true,
    target: undefined,
  },
  {
    path: "https://github.com/tunogya/aai-app/issues",
    name: "Issues",
    prefetch: false,
    target: "_blank",
  },
];

const CoreNav = () => {
  const path = usePathname();

  return (
    <div className={""}>
      {menu.map((item, index) => (
        <div
          className={"flex items-center select-none cursor-pointer"}
          key={index}
        >
          <div
            className={`bg-white w-4 h-5 ${
              path.includes(item.path) ? `border-l-2 border-[#0066FF]` : ""
            }`}
          ></div>
          <Link
            target={item.target}
            href={`${item.path}`}
            prefetch={item.prefetch}
            scroll={false}
            className={`text-sm font-semibold hover:bg-gray-50 w-full p-2 rounded flex items-center ${
              path.includes(item.path) ? `text-[#0066FF]` : "text-gray-700"
            } ${item.target === "_blank" ? "underline italic" : ""}`}
          >
            {item.name}
            {item.target === "_blank" && (
              <ArrowTopRightOnSquareIcon className={"w-4 h-4 ml-1"} />
            )}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CoreNav;
