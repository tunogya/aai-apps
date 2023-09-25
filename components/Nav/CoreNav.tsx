"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const menu = [
  {
    path: "/dashboard",
    name: "Dashboard",
  },
  {
    path: "/chat",
    name: "Chat",
  },
  // {
  //   path: "/note",
  //   name: "Note",
  // },
  {
    path: "/usage",
    name: "Usage",
  },
];

const CoreNav = () => {
  const searchParams = useSearchParams();
  const path = usePathname();

  const model = searchParams.get("model") || "gpt-3.5-turbo";
  const isPurple = model.startsWith("gpt-4");

  return (
    <div className={""}>
      {menu.map((item, index) => (
        <div className={"flex items-center select-none"} key={index}>
          <div
            className={`bg-white w-4 h-5 ${
              path.includes(item.path)
                ? `border-l-2 ${
                    isPurple ? "border-[#AB68FF]" : "border-[#19C37D]"
                  }`
                : ""
            }`}
          ></div>
          <Link
            href={`${item.path}?model=${
              searchParams.get("model") || "gpt-3.5-turbo"
            }`}
            prefetch={true}
            scroll={false}
            className={`text-sm font-semibold hover:bg-gary-100 w-full p-2 rounded ${
              path.includes(item.path)
                ? `${isPurple ? "text-[#AB68FF]" : "text-[#19C37D]"}`
                : "text-gary-800"
            }`}
          >
            {item.name}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CoreNav;
