import OpenAI from "openai";

export const runtime = "edge";
// @ts-ignore
export async function POST(req: Request): Promise<Response> {
  let { model, input, voice, response_format, speed } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.audio.speech.create({
      model,
      voice,
      input,
      response_format,
      speed,
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="audio.mp3"',
      },
    });
  } catch (e) {
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
