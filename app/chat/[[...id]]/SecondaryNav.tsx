"use client";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";
import dynamic from "next/dynamic";
import {
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import { Transition } from "@headlessui/react";
import { useHover } from "@uidotdev/usehooks";
import { useUser } from "@auth0/nextjs-auth0/client";
import ModelSwitch from "@/app/components/ModelSwitch";

const SecondaryNavItem = dynamic(
  () => import("@/app/chat/[[...id]]/SecondaryNavItem"),
);

const SecondaryNav = () => {
  const [ref, hovering] = useHover();
  const { user } = useUser();
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.nextCursor) return null;
    if (pageIndex === 0) return `/api/conversation?limit=20`;
    return `/api/conversation?cursor=${previousPageData.nextCursor}&limit=20`;
  };

  const { data, size, setSize, isLoading } = useSWRInfinite(
    getKey,
    (url) => fetch(url).then((res) => res.json()),
    {
      refreshInterval: 3_000,
    },
  );

  const reducedData = useMemo(() => {
    if (!data) return [];
    return data.reduce((a, b) => a.concat(b?.items || []), []);
  }, [data]);

  const haveMore = useMemo(() => {
    return reducedData.length % 20 === 0 && reducedData.length > 0;
  }, [reducedData]);

  const [hidden, setHidden] = useState(true);

  return (
    <div
      className={`relative z-10 ${
        hovering || hidden ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div
        className={`absolute h-[100vh] ${
          hidden ? "right-[-96px]" : "right-0"
        } top-[0]`}
      >
        {hidden && (
          <div className={"w-24 p-3"}>
            <Link
              href={`/chat`}
              prefetch
              className={`w-fit hover:bg-gray-100 p-3 cursor-pointer rounded-full text-gray-800 hidden md:block border`}
            >
              <PlusIcon className={"w-4 h-4 stroke-2"} />
            </Link>
          </div>
        )}
        <div
          className={
            "h-[calc(100vh-160px)] absolute top-0 left-0 flex items-center px-2 my-20"
          }
        >
          <button
            ref={ref}
            onClick={() => setHidden(!hidden)}
            className={`py-2 cursor-pointer text-gray-800 ${
              hidden ? "bg-white" : "bg-gray-50"
            } hover:bg-gray-100 rounded-lg border`}
          >
            {hidden ? (
              <ChevronRightIcon className={"w-4 h-4"} />
            ) : (
              <ChevronLeftIcon className={"w-4 h-4"} />
            )}
          </button>
        </div>
      </div>
      <Transition
        enter="ease-out duration-75"
        enterFrom="w-0"
        enterTo="w-[300px]"
        leave="ease-in duration-150"
        leaveFrom="w-[300px]"
        leaveTo="w-0"
        show={!hidden}
        appear={true}
        className={"overflow-hidden border-r"}
      >
        <div className={`w-[300px] shrink-0 pt-2 md:pt-0`}>
          <Link
            href={`/chat`}
            prefetch
            className={
              "hidden md:flex items-center border hover:bg-gray-50 p-3 rounded cursor-pointer select-none m-2 text-gray-800"
            }
          >
            <div className={"p-1"}>
              <PlusIcon className={"w-4 h-4 stroke-2"} />
            </div>
            <div className={"text-sm text-gray-800"}>New Chat</div>
          </Link>
          <div className={"h-[calc(100vh-66px)] overflow-y-auto px-2"}>
            {isLoading && <Skeleton count={5} height={"36px"} />}
            {reducedData?.length > 0 && (
              <div className={"mb-2"}>
                {reducedData?.map((item: any) => (
                  <SecondaryNavItem key={item.SK} item={item} />
                ))}
              </div>
            )}
            {haveMore ? (
              <button
                className={`w-full border p-2 mb-2 text-xs hover:bg-gray-50 rounded ${
                  isLoading ? "cursor-wait" : ""
                }`}
                onClick={() => setSize(size + 1)}
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            ) : null}
            <div className={"h-[180px] md:hidden"}></div>
          </div>
        </div>
        <div
          className={
            "md:hidden bg-white border-t border-r absolute bottom-0 left-0 w-full px-2 py-1 pb-1 space-y-1 shrink-0 overflow-hidden"
          }
        >
          <div
            className={"border-b flex justify-center items-center pb-1 mb-1"}
          >
            <ModelSwitch />
          </div>
          <Link href={"/billing"}>
            <div
              className={
                "bg-black px-3 py-2 text-white rounded w-full font-semibold shrink-0 whitespace-nowrap text-center"
              }
            >
              Manage Billing
            </div>
          </Link>
          <div
            className={
              "flex items-center justify-between space-x-1 border-t pt-1"
            }
          >
            <div className={"text-sm text-gray-800 truncate"}>
              {user?.email}
            </div>
            <a href={"/api/auth/logout"}>
              <ArrowRightOnRectangleIcon className={"w-4 h-4 stroke-2"} />
            </a>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default SecondaryNav;
