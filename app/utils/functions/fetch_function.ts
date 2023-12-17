import { ChatCompletionCreateParams } from "openai/resources/chat";
import { FunctionCall, Message } from "ai";

export const fetch_function: ChatCompletionCreateParams.Function = {
  name: "fetch_function",
  description: "Fetch data from the internet.",
  parameters: {
    type: "object",
    properties: {
      input: {
        type: "string",
        description: "The URL to fetch.",
      },
      method: {
        type: "string",
        description:
          "The HTTP method to use. Defaults to GET if not specified.",
        default: "GET",
      },
      headers: {
        type: "object",
        description: "The headers to send with the request.",
        default: {
          "Content-Type": "application/json",
        },
      },
      body: {
        type: "string",
        description: "The body of the request.",
        default: "{}",
      },
    },
    required: ["input"],
  },
};

export const fetch_function_handler = async (
  chatMessages: Message[],
  functionCall: FunctionCall,
) => {
  if (functionCall.arguments) {
    const parsedFunctionCallArguments: {
      input: string;
      method: any;
      headers: any;
      body: any;
    } = JSON.parse(functionCall.arguments);
    try {
      return await fetch(parsedFunctionCallArguments.input, {
        method: parsedFunctionCallArguments.method,
        headers: parsedFunctionCallArguments.headers,
        body: parsedFunctionCallArguments.body,
      }).then((res) => res.text());
    } catch (e) {
      return `An error occurred during eval: ${e}`;
    }
  } else {
    return `No arguments provided.`;
  }
};
