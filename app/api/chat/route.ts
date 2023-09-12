import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// @ts-ignore
export async function POST(req: Request): Promise<Response> {
  const json = await req.json();
  const { messages, model } = json;

  // if (!userId) {
  //   return new Response("Unauthorized", {
  //     status: 401,
  //   });
  // }

  try {
    const res = await openai.createChatCompletion({
      model,
      messages,
      temperature: 0.7,
      stream: true,
      max_tokens: 500,
    });

    const stream = OpenAIStream(res, {
      async onCompletion(completion) {
        // TODO
      },
    });

    return new StreamingTextResponse(stream);
  } catch (e) {
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
