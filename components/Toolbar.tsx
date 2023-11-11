"use client";
import { Popover, Transition } from "@headlessui/react";
import React, { FC, Fragment } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ModelSwitch from "@/components/ModelSwitch";
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  Snippet,
  useInstantSearch,
} from "react-instantsearch";
import searchClient from "@/utils/searchClient";
import CustomSearchBox from "@/components/CustomSearchBox";
import { useUser } from "@auth0/nextjs-auth0/client";

function Hit({ hit }: any) {
  const id = hit.objectID;

  return (
    <Link href={"/chat/" + id}>
      <div
        className={
          "text-sm px-4 py-3 flex items-center text-gray-800 hover:bg-gray-100"
        }
      >
        <div className={"w-6 shrink-0"}>
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div>{hit?.messages?.[0].content}</div>
      </div>
    </Link>
  );
}

const Toolbar: FC<{ border?: boolean }> = (props) => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div
      className={`hidden h-[60px] w-full md:flex items-center justify-between px-4 md:px-10 ${
        props.border ? "border-b" : ""
      }`}
    >
      <div className={"relative"}>
        <InstantSearch searchClient={searchClient} indexName="chat_search">
          <Configure
            hitsPerPage={10}
            facets={["author"]}
            facetFilters={[`author:${user?.sub}`]}
          />
          <CustomSearchBox />
          <Hits
            hitComponent={Hit}
            className={
              "absolute mt-2 bg-white border shadow w-[600px] rounded-lg z-20 h-[50vh] overflow-y-auto"
            }
          />
        </InstantSearch>
      </div>
      <div className={"text-sm font-semibold flex items-center space-x-1"}>
        <Link
          href={"/developers"}
          prefetch
          className={`px-2 py-1.5 hover:bg-gray-100 rounded-lg text-sm font-medium ${
            pathname.startsWith("/developers")
              ? "text-[#0066FF]"
              : "text-gray-800"
          }`}
        >
          Developers
        </Link>
        <ModelSwitch />
        <Link
          href={
            "https://www.abandon.ai/docs/resource/Introduction/introduction"
          }
          target={"_blank"}
          className={
            "hover:bg-gray-100 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          }
        >
          <QuestionMarkCircleIcon className={"w-5 h-5 text-gray-800"} />
        </Link>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={
                  "hover:bg-gray-100 p-2 rounded-full text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel
                  className={
                    "absolute mt-1 right-0 w-40 rounded border shadow py-2 z-50 bg-white"
                  }
                >
                  <a href={"/api/auth/logout"}>
                    <div
                      className={
                        "hover:bg-gray-100 w-full py-2 px-4 font-semibold text-start text-red-500"
                      }
                    >
                      Logout
                    </div>
                  </a>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default Toolbar;
