import { ChatCompletionCreateParams } from "openai/resources/chat";
import { FunctionCall } from "ai";

export const eval_code_in_browser: ChatCompletionCreateParams.Function = {
  name: "eval_code_in_browser",
  description:
    "Use eval to execute JavaScript code in the browser. You can make API requests using the fetch method.",
  parameters: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: `Javascript code that will be directly executed via eval(). Do not use backticks in your response.
           DO NOT include any newlines in your response, and be sure to provide only valid JSON when providing the arguments object.
           The output of the eval() will be returned directly by the function.`,
      },
    },
    required: ["code"],
  },
};

export const eval_code_in_browser_handler = async (
  functionCall: FunctionCall,
) => {
  if (functionCall.arguments) {
    // Parsing here does not always work since it seems that some characters in generated code aren't escaped properly.
    const parsedFunctionCallArguments: { code: string } = JSON.parse(
      functionCall.arguments,
    );
    try {
      let result = await eval(parsedFunctionCallArguments.code);
      try {
        result = JSON.stringify(result);
      } catch (e) {
        console.log(e);
      }
      return `${result}`;
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
