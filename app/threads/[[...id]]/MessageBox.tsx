import React, { FC } from "react";
import { ThreadMessage } from "openai/src/resources/beta/threads/messages/messages";

const MessageBox: FC<{
  message: ThreadMessage;
}> = ({ message }) => {
  return (
    <div
      className={`border-b p-5 flex flex-col ${
        message?.role === "user" ? "bg-gray-50" : ""
      }`}
    >
      <div className={"text-sm text-gray-500 flex justify-between mb-1"}>
        <div>{message?.role}</div>
        <div className={"text-gray-400 text-[13px]"}>
          {new Date(message?.created_at * 1000).toLocaleString()}
        </div>
      </div>
      {message.content?.[0].type === "text" && (
        <div className={"text-gray-600 break-words"}>
          {message.content[0].text.value}
        </div>
      )}
      {message.content?.[0].type === "image_file" && (
        <div className={"text-gray-600 break-words"}>
          file_id: {message.content[0].image_file.file_id}
        </div>
      )}
      {message?.run_id && (
        <div
          className={
            "text-xs border px-2 py-1 text-gray-800 w-fit rounded mt-2 bg-gray-100"
          }
        >
          run_id: {message.run_id}
        </div>
      )}
    </div>
  );
};

export default MessageBox;
