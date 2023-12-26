import { ChatCompletionCreateParams } from "openai/resources/chat";
import { FunctionCall } from "ai";

export const serper_google_search: ChatCompletionCreateParams.Function = {
  name: "serper_google_search",
  description: "Search Google using Serper API.",
  parameters: {
    type: "object",
    properties: {
      q: {
        type: "string",
        description: "The query to search for.",
      },
      num: {
        type: "number",
        description:
          "The number of results to return. Defaults to 10. Max is 100.",
        default: 10,
      },
    },
    required: ["q"],
  },
};

export const serper_google_search_handler = async (
  functionCall: FunctionCall,
) => {
  if (functionCall.arguments) {
    const parsedFunctionCallArguments: {
      q: string;
      num: number;
    } = JSON.parse(functionCall.arguments);
    try {
      const data = await fetch(`/api/serper/search`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: parsedFunctionCallArguments.q,
          num: parsedFunctionCallArguments.num,
        }),
      }).then((res) => res.json());
      return JSON.stringify(data);
    } catch (e) {
      return JSON.stringify({
        error: "Something went wrong. Please try again late",
        message: e,
      });
    }
  } else {
    return `No arguments provided.`;
  }
};
