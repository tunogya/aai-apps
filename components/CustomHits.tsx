import { useHits } from "react-instantsearch";
import Link from "next/link";
import React from "react";

function Hit({ hit }: any) {
  const id = hit.objectID;

  return (
    <Link href={"/chat/" + id}>
      <div className={"text-sm px-4 py-3 text-gray-800 border-b"}>
        <div className={"flex justify-between items-center"}>
          <div className={"truncate text-[#0066FF] font-medium text-lg"}>
            {hit?.title}
          </div>
          <div className={"text-gray-600 text-xs"}>
            {new Date(Number(hit?.updated) * 1000).toLocaleString()}
          </div>
        </div>
        <div className={"flex flex-col space-y-1 mt-2"}>
          {hit?._snippetResult?.messages
            ?.filter((item: any) => item?.content?.matchLevel === "full")
            ?.map((item: any, index: number) => (
              <span
                key={index}
                className={`p-2 bg-gray-100 rounded ${
                  item?.role?.value === "user" ? "border-r-4" : "border-l-4"
                }`}
                dangerouslySetInnerHTML={{
                  __html: item?.content?.value,
                }}
              />
            ))}
        </div>
      </div>
    </Link>
  );
}

const CustomHits = (props: any) => {
  const { hits, results, sendEvent } = useHits(props);

  if (!results || !results.query) {
    return null;
  }

  return (
    <div className="absolute mt-2 bg-white border shadow w-full rounded-lg z-20 h-[50vh] overflow-y-auto overflow-x-hidden">
      <div className={"px-4 py-2 border-b"}>
        <div className={"font-semibold text-gray-800"}>Chats</div>
      </div>
      {hits.length > 0 ? (
        hits.map((hit: any) => <Hit hit={hit} key={hit.objectID} />)
      ) : (
        <div className={"px-4 py-2 text-gray-600"}>No result</div>
      )}
    </div>
  );
};

export default CustomHits;
