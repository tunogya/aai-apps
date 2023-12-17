import { ChatCompletionCreateParams } from "openai/resources/chat";
import { FunctionCall, Message } from "ai";

export const dall_e_images_generate: ChatCompletionCreateParams.Function = {
  name: "dall_e_images_generate",
  description: "Generate images using DALL-E",
  parameters: {
    type: "object",
    properties: {
      prompt: {
        type: "string",
        description: "The prompt to generate images for",
      },
      model: {
        type: "string",
        description: "The DALL-E model to use",
        enum: ["dall-e-2", "dall-e-3"],
        default: "dall-e-2",
      },
      n: {
        type: "integer",
        description:
          "The number of images to generate. when model is 'dall-e-3', n must be 1; otherwise (1 <= n <= 4)",
        minimum: 1,
        maximum: 4,
        default: 1,
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

export const dall_e_images_generate_handler = async (
  chatMessages: Message[],
  functionCall: FunctionCall,
) => {
  if (functionCall.arguments) {
    // Parsing here does not always work since it seems that some characters in generated code aren't escaped properly.
    const parsedFunctionCallArguments: {
      prompt: string;
      size: string;
      model: string;
      n: number;
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
          model: parsedFunctionCallArguments.model,
          n: parsedFunctionCallArguments.n,
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
