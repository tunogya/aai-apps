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
        description: "The prompt to generate images for.",
      },
      size: {
        type: "string",
        description: "The size of the generated images.",
        enum: ["1024x1024", "1024×1792", "1792×1024"],
        default: "1024x1024",
      },
      quality: {
        type: "string",
        description: "The quality of the generated images.",
        enum: ["standard", "hd"],
        default: "standard",
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
      quality: string;
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
          quality: parsedFunctionCallArguments.quality,
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
