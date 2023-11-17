import OpenAI from "openai";
import calculateHash from "@/app/utils/calculateHash";
import s3Client from "@/app/utils/s3Client";
import {
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  let { model, input, voice, response_format, speed } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const hash = await calculateHash(
    JSON.stringify({
      model,
      input,
      voice,
      response_format,
      speed,
    }),
  );

  try {
    const file = await s3Client.send(
      new GetObjectCommand({
        Bucket: "abandonai-prod",
        Key: `audio/${hash}.mp3`,
      }),
    );

    if (file.Body) {
      // @ts-ignore
      return new Response(file.Body, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": 'attachment; filename="audio.mp3"',
        },
      });
    }
  } catch (e) {
    if (e instanceof NoSuchKey) {
      console.log("NoSuchKey ");
    } else {
      console.log(e);
    }
  }

  try {
    const response = await openai.audio.speech.create({
      model,
      voice,
      input,
      response_format,
      speed,
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    try {
      const jsonBuffer = Buffer.from(
        JSON.stringify({
          model,
          input,
          voice,
          response_format,
          speed,
        }),
      );
      await Promise.all([
        s3Client.send(
          new PutObjectCommand({
            Bucket: "abandonai-prod",
            Key: `audio/${hash}.mp3`,
            Body: buffer,
            ContentType: "audio/mpeg",
          }),
        ),
        s3Client.send(
          new PutObjectCommand({
            Bucket: "abandonai-prod",
            Key: `audio/${hash}.json`,
            Body: jsonBuffer,
            ContentType: "application/json",
          }),
        ),
      ]);
    } catch (e) {
      console.log(e);
    }
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
