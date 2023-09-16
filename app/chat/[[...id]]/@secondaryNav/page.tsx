"use client";
import useSWR from "swr";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

const SecondaryNav = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data, isLoading, mutate, error } = useSWR(
    "/api/conversation",
    (url) => fetch(url).then((res) => res.json()),
  );

  const currentChatId = params?.id?.[0] || null;

  return (
    <div
      className={
        "w-[300px] shrink-0 h-full border-r overflow-y-auto flex flex-col"
      }
    >
      <Link
        href={`/chat?model=${searchParams.get("model") || "gpt-3.5-turbo"}`}
        className={
          "flex items-center border hover:bg-stone-100 p-3 rounded cursor-pointer select-none m-2"
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <div className={"text-sm"}>New Chat</div>
      </Link>
      <div className={"h-full overflow-y-auto pl-2 pr-4"}>
        {!data && isLoading && <div className={"text-sm"}>Loading...</div>}
        {data &&
          data.items
            .sort((a: any, b: any) => b.created - a.created) // descending
            .map((item: any) => (
              <Link
                href={`/chat/${item.SK.replace("CHAT#", "")}?model=${
                  searchParams.get("model") || "gpt-3.5-turbo"
                }`}
                key={item.SK}
                className={`flex w-full items-center hover:bg-stone-100 px-3 py-2 rounded cursor-pointer select-none ${
                  item.SK.replace("CHAT#", "") === currentChatId
                    ? "bg-stone-100"
                    : ""
                }`}
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
                <div className={"truncate text-sm"}>{item.title}</div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default SecondaryNav;
