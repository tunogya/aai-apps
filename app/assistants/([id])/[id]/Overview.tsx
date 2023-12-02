"use client";

import AddTgBotModal from "@/app/assistants/([id])/[id]/AddTgBotModal";
import useSWR from "swr";
import { FC } from "react";
import TgBotInfo from "@/app/assistants/([id])/[id]/TgBotInfo";
import Skeleton from "react-loading-skeleton";

const CSRPage: FC<{
  assistantId: string;
}> = ({ assistantId }) => {
  const { data, mutate, isLoading } = useSWR(
    assistantId ? `/api/assistants/${assistantId}/accounts` : undefined,
    (url) => fetch(url).then((res) => res.json()),
  );

  return (
    <div className={"space-y-6 pt-4"}>
      <div>
        <div className={"flex justify-between items-center pb-3 border-b"}>
          <div className={"font-semibold text-gray-800"}>Telegram Bot</div>
          <AddTgBotModal assistantId={assistantId} callback={mutate} />
        </div>
        {isLoading && <Skeleton className={"h-6"} count={3} />}
        {data?.item?.telegram && (
          <TgBotInfo
            token={data?.item?.telegram?.token}
            webhook={data?.item?.telegram?.webhook}
          />
        )}
        {!data?.item?.telegram && !isLoading && (
          <div className={"pt-3 text-sm text-gray-500"}>No Bot</div>
        )}
      </div>
    </div>
  );
};

export default CSRPage;
