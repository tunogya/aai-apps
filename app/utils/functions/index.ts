import { ChatCompletionCreateParams } from "openai/resources/chat";
import { FunctionCallHandler } from "ai";
import {
  eval_code_in_browser,
  eval_code_in_browser_handler,
} from "./eval_code_in_browser";
import {
  dall_e_images_generate,
  dall_e_images_generate_handler,
} from "@/app/utils/functions/dall_e_images_generate";
import {
  serper_google_search,
  serper_google_search_handler,
} from "@/app/utils/functions/serper_google_search";
import dysortid from "@/app/utils/dysortid";

const functions: ChatCompletionCreateParams.Function[] = [
  eval_code_in_browser,
  dall_e_images_generate,
  serper_google_search,
];

const functionHandlerMap: Record<string, any> = {
  eval_code_in_browser: eval_code_in_browser_handler,
  dall_e_images_generate: dall_e_images_generate_handler,
  serper_google_search: serper_google_search_handler,
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
          id: dysortid(),
          name: functionCall.name,
          role: "function" as const,
          content: "Function handler not found",
        },
      ],
    };
  }
  const content = await handler(functionCall);
  return {
    messages: [
      ...chatMessages,
      {
        id: dysortid(),
        name: functionCall.name,
        role: "function" as const,
        content: content as string,
      },
    ],
  };
};

export { functions, functionCallHandler };
