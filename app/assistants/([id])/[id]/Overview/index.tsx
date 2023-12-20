"use client";

import AddTgBotModal from "@/app/assistants/([id])/[id]/Overview/AddTgBotModal";
import useSWR from "swr";
import { FC } from "react";
import TgBotInfo from "@/app/assistants/([id])/[id]/Overview/TgBotInfo";
import Skeleton from "react-loading-skeleton";

const CSRPage: FC<{
  assistantId: string;
}> = ({ assistantId }) => {
  const { data, isLoading, mutate } = useSWR(
    assistantId ? `/api/assistants/${assistantId}` : undefined,
    (url) => fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"space-y-6 pt-4"}>
      <div>
        <div
          className={"flex justify-between items-center pb-3 border-b w-full"}
        >
          <div className={"font-semibold text-gray-800"}>Telegram</div>
          <AddTgBotModal assistantId={assistantId} callback={mutate} />
        </div>
        {isLoading && <Skeleton className={"h-6"} count={3} />}
        {data?.item?.metadata?.telegram && (
          <TgBotInfo token={data.item.metadata.telegram} />
        )}
        {!data?.item?.metadata?.telegram && !isLoading && (
          <div className={"pt-3 text-sm text-gray-500"}>NaN</div>
        )}
      </div>
    </div>
  );
};

export default CSRPage;
