"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menu = [
  {
    name: "Persona",
    path: "/persona",
    children: [],
  },
  {
    name: "Chat",
    path: "/chat",
    children: [],
  },
  {
    name: "Write",
    path: "/write",
    children: [],
  },
  {
    name: "Activity",
    path: "/activity",
    children: [],
  },
  {
    name: "Settings",
    path: "/settings",
    children: [],
  },
  {
    name: "Help & Support",
    path: "/help",
    children: [],
  },
];

export default function Component() {
  const pathname = usePathname();
  const [curPath, setCurPath] = useState(pathname);

  return (
    <div className={"flex flex-col gap-2"}>
      {menu.map((item, index) => (
        <Link
          href={item.path}
          key={index}
          onClick={() => setCurPath(item.path)}
          className={`text-sm mt-0 mx-4 px-4 py-1.5 font-semibold ${
            curPath.includes(item.path)
              ? "bg-blue-100 text-blue-400"
              : "hover:bg-gray-200 hover:text-gray-500"
          } rounded`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
