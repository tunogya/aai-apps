import { useHits } from "react-instantsearch";
import Link from "next/link";
import React from "react";

function Hit({ hit }: any) {
  const id = hit.objectID;
  return (
    <Link href={"/chat/" + id}>
      <div className={"text-sm px-4 py-3 text-gray-800 hover:bg-gray-100"}>
        <div className={"flex items-start gap-1"}>
          <div className={"text-sm"}>
            {hit._snippetResult.messages
              .filter((item: any) => item.content.matchLevel === "full")
              .map((item: any, index: number) => (
                <div
                  key={index}
                  className={"line-clamp-2 text-gray-500"}
                  dangerouslySetInnerHTML={{
                    __html: item.content.value,
                  }}
                />
              ))}
          </div>
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
    <div className="absolute mt-2 bg-white border shadow w-[600px] rounded-lg z-20 h-[50vh] overflow-y-auto">
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
