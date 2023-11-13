import OpenAI from "openai";

export const runtime = "edge";

// @ts-ignore
export async function POST(req: Request): Promise<Response> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    // const transcription = await openai.audio.transcriptions.create({
    //     model,
    //     file: fs.createReadStream("audio.mp3")
    //   }
    // );
    //
    // console.log(transcription.text);
  } catch (e) {
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
