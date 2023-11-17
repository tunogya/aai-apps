import { ChatCompletionCreateParams } from "openai/resources/chat";
import { FunctionCall, Message } from "ai";

export const dall_e_3_images_generate: ChatCompletionCreateParams.Function = {
  name: "dall_e_3_images_generate",
  description: "Generate images using DALL-E 3",
  parameters: {
    type: "object",
    properties: {
      prompt: {
        type: "string",
        description: "The prompt to generate images for",
      },
      size: {
        type: "string",
        description: "The size of the generated images",
        enum: ["1024x1024", "1024×1792", "1792×1024"],
        default: "1024x1024",
      },
    },
    required: ["prompt"],
  },
};

export const dall_e_3_images_generate_handler = async (
  chatMessages: Message[],
  functionCall: FunctionCall,
) => {
  if (functionCall.arguments) {
    // Parsing here does not always work since it seems that some characters in generated code aren't escaped properly.
    const parsedFunctionCallArguments: {
      prompt: string;
      size: string;
    } = JSON.parse(functionCall.arguments);
    try {
      const data = await fetch(`/api/images/generations`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: parsedFunctionCallArguments.prompt,
          size: parsedFunctionCallArguments.size,
        }),
      }).then((res) => res.json());
      return JSON.stringify(data);
    } catch (e) {
      return `An error occurred during eval: ${e}`;
    }
  } else {
    return `No arguments provided.`;
  }
};
