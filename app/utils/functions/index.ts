import { ChatCompletionCreateParams } from "openai/resources/chat";
import { FunctionCallHandler, nanoid } from "ai";
import {
  get_current_weather,
  get_current_weather_handler,
} from "./get_current_weather";
import {
  eval_code_in_browser,
  eval_code_in_browser_handler,
} from "./eval_code_in_browser";

const functions: ChatCompletionCreateParams.Function[] = [
  get_current_weather,
  eval_code_in_browser,
];

const functionHandlerMap: Record<string, any> = {
  get_current_weather: get_current_weather_handler,
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
