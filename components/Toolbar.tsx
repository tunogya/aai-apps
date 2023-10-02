"use client";
import { Popover, Switch, Transition } from "@headlessui/react";
import { FC, Fragment, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Toolbar: FC<{ border?: boolean }> = (props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [useGPT4, setUseGPT4] = useState(searchParams.get("model") === "GPT-4");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (useGPT4) {
      params.set("model", "GPT-4");
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      params.set("model", "GPT-3.5");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [useGPT4]);

  return (
    <div
      className={`hidden h-[60px] w-full md:flex items-center justify-between px-4 md:px-10 ${
        props.border ? "border-b" : ""
      }`}
    >
      <div className={"lg:w-[240px] xl:w-[300px]"}>
        <input
          placeholder={"Search"}
          className={
            "w-full px-4 py-2 focus:bg-gray-50 hover:bg-gray-50 focus:outline-0 rounded text-sm"
          }
        />
      </div>
      <div className={"text-sm font-semibold flex items-center space-x-1"}>
        <div className={"text-sm font-semibold"}>
          <div
            className={
              "flex items-center space-x-2 hover:bg-gray-100 p-2 rounded cursor-pointer select-none"
            }
            onClick={() => setUseGPT4(!useGPT4)}
          >
            <div
              className={`flex space-x-1 text-sm ${
                useGPT4 ? "text-[#AB68FF]" : "text-gray-800"
              }`}
            >
              <div className={"whitespace-nowrap"}>GPT-4 Model</div>
            </div>
            <Switch
              checked={useGPT4}
              className={`${useGPT4 ? "bg-[#AB68FF]" : "bg-gray-200"}
          relative inline-flex h-[14px] w-[24px] shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span className="sr-only">GPT-4 Model</span>
              <span
                aria-hidden="true"
                className={`${useGPT4 ? "translate-x-2.5" : "translate-x-0"}
            pointer-events-none inline-block h-[12px] w-[12px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
        </div>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={
                  "hover:bg-gray-100 p-2 rounded-full text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
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
                    "absolute mt-1 right-0 w-40 rounded border shadow py-2 z-50"
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
