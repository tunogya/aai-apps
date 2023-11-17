import React, { FC, Fragment } from "react";
import AssistantMessageBox from "@/app/components/MessageBox/AssistantMessageBox";
import UserMessageBox from "@/app/components/MessageBox/UserMessageBox";
import FunctionMessageBox from "@/app/components/MessageBox/FunctionMessageBox";
import { Message } from "ai";
import { useUser } from "@auth0/nextjs-auth0/client";

const MessageBox: FC<{
  messages: Message[];
  currentChatId: string;
  isLoading: boolean;
  isPurple: boolean;
}> = ({ messages, currentChatId, isLoading, isPurple }) => {
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
                isPurple={isPurple}
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
                isPurple={isPurple}
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