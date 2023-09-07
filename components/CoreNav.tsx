import Link from "next/link";
import { FC } from "react";

const menu = [
  {
    path: "/dashboard",
    name: "Dashboard",
  },
  {
    path: "/chat",
    name: "Chat",
  },
  {
    path: "/write",
    name: "Write",
  },
  {
    path: "/billing",
    name: "Billing",
  },
];

const CoreNav: FC<{
  active: string;
}> = (props) => {
  return (
    <div className={"space-y-2"}>
      {menu.map((item, index) => (
        <div className={"flex space-x-2 items-center"} key={index}>
          <div
            className={`bg-white w-4 h-5 ${
              props.active === item.path ? "border-l-2 border-blue-600" : ""
            }`}
          ></div>
          <Link
            href={item.path}
            className={`text-sm font-semibold ${
              props.active === item.path ? "text-blue-600" : "text-gray-800"
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
