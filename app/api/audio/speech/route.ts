import { getSession } from "@auth0/nextjs-auth0";
import OpenAI from "openai";

// @ts-ignore
export async function POST(req: Request): Promise<Response> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  let { model, input, voice, response_format, speed } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const mp3 = await openai.audio.speech.create({
      model,
      voice,
      input,
      response_format,
      speed,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new Response(buffer, {
      status: 200,
    });
  } catch (e) {
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
