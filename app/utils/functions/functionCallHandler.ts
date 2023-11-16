import { FunctionCallHandler, nanoid } from "ai";

const functionCallHandler: FunctionCallHandler = async (
  chatMessages,
  functionCall,
) => {
  if (functionCall.name === "eval_code_in_browser") {
    if (functionCall.arguments) {
      // Parsing here does not always work since it seems that some characters in generated code aren't escaped properly.
      const parsedFunctionCallArguments: { code: string } = JSON.parse(
        functionCall.arguments,
      );
      let result: string;
      try {
        result = `${eval(parsedFunctionCallArguments.code)}`;
      } catch (e) {
        result = `An error occurred during eval: ${e}`;
      }
      return {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: "eval_code_in_browser",
            role: "function" as const,
            content: result,
          },
        ],
      };
    }
  } else if (functionCall.name === "get_current_weather") {
    return {
      messages: [
        ...chatMessages,
        {
          id: nanoid(),
          name: "get_current_weather",
          role: "function" as const,
          content: JSON.stringify({
            temperature: 10,
            unit: "C",
          }),
        },
      ],
    };
  }
};

export default functionCallHandler;
