import { ChatCompletionCreateParams } from "openai/resources/chat";
import { FunctionCallHandler, nanoid } from "ai";
import {
  eval_code_in_browser,
  eval_code_in_browser_handler,
} from "./eval_code_in_browser";

const functions: ChatCompletionCreateParams.Function[] = [eval_code_in_browser];

const functionHandlerMap: Record<string, any> = {
  eval_code_in_browser: eval_code_in_browser_handler,
};

const functionCallHandler: FunctionCallHandler = async (
  chatMessages,
  functionCall,
) => {
  const handler = functionHandlerMap[functionCall.name!];
  if (!handler) {
    return {
      messages: [
        ...chatMessages,
        {
          id: nanoid(),
          name: functionCall.name,
          role: "function" as const,
          content: "Function handler not found",
        },
      ],
    };
  }
  const content = await handler(chatMessages, functionCall);
  return {
    messages: [
      ...chatMessages,
      {
        id: nanoid(),
        name: functionCall.name,
        role: "function" as const,
        content: content as string,
      },
    ],
  };
};

export { functions, functionCallHandler };
