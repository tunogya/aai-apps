import { getSession } from "@auth0/nextjs-auth0/edge";
import OpenAI from "openai";
import fs from "fs";

// @ts-ignore
export async function POST(req: Request): Promise<Response> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  // let {model, file} = await req.json();

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
