import { useHits } from "react-instantsearch";
import Link from "next/link";
import React from "react";

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

const CustomHits = (props: any) => {
  const { hits, results, sendEvent } = useHits(props);

  if (!results || !results.query || !results.hits.length) {
    return null;
  }

  return (
    <div className="absolute mt-2 bg-white border shadow w-[600px] rounded-lg z-20 h-[50vh] overflow-y-auto">
      <div className={"px-4 py-2 border-b"}>
        <div className={"font-semibold text-gray-800"}>Chats</div>
      </div>
      {hits.map((hit: any) => (
        <Hit hit={hit} key={hit.objectID} />
      ))}
    </div>
  );
};

export default CustomHits;
