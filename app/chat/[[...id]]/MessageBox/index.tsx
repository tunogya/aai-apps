import React, { FC, Fragment } from "react";
import AssistantMessageBox from "@/app/chat/[[...id]]/MessageBox/AssistantMessageBox";
import UserMessageBox from "@/app/chat/[[...id]]/MessageBox/UserMessageBox";
import FunctionMessageBox from "@/app/chat/[[...id]]/MessageBox/FunctionMessageBox";
import { Message } from "ai";
import { useUser } from "@auth0/nextjs-auth0/client";

const MessageBox: FC<{
  messages: Message[];
  currentChatId: string;
  isLoading: boolean;
  useGPT4: boolean;
}> = ({ messages, currentChatId, isLoading, useGPT4 }) => {
  const { user } = useUser();

  return (
    <>
      {messages
        .map((message, index) => (
          <Fragment key={index}>
            {message.role === "assistant" && !!message.content && (
              <AssistantMessageBox
                message={message}
                index={index}
                isLast={index === messages.length - 1}
                currentChatId={currentChatId}
                isLoading={isLoading}
                isGPT4={useGPT4}
              />
            )}
            {message.role === "user" && (
              <UserMessageBox
                message={message}
                index={index}
                currentChatId={currentChatId}
                picture={user?.picture}
              />
            )}
            {message.role === "function" && (
              <FunctionMessageBox
                message={message}
                isLast={index === messages.length - 1}
                index={index}
                isLoading={isLoading}
                isGPT4={useGPT4}
              />
            )}
          </Fragment>
        ))
        .reverse()}
      <div className={"h-20 xl:hidden"}></div>
    </>
  );
};

export default MessageBox;
