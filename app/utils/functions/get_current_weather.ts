import { ChatCompletionCreateParams } from "openai/resources/chat";
import { FunctionCall, Message } from "ai";

export const get_current_weather: ChatCompletionCreateParams.Function = {
  name: "get_current_weather",
  description: "Get the current weather.",
  parameters: {
    type: "object",
    properties: {
      format: {
        type: "string",
        enum: ["celsius", "fahrenheit"],
        description: "The temperature unit to use.",
      },
    },
    required: ["format"],
  },
};

export const get_current_weather_handler = async (
  chatMessages: Message[],
  functionCall: FunctionCall,
) => {
  return JSON.stringify({
    temperature: 10,
    format: "celsius",
  });
};
