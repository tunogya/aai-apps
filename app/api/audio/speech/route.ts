import OpenAI from "openai";
import calculateHash from "@/app/utils/calculateHash";
import s3Client from "@/app/utils/s3Client";
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import redisClient from "@/app/utils/redisClient";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  const isPremium = await redisClient.get(`premium:${sub}`);

  if (!isPremium) {
    return NextResponse.json({
      error: "premium required",
      message: "Sorry, you need a Premium subscription to use this.",
    });
  }

  let { model, input, voice, response_format, speed } = await req.json();

  const openai = new OpenAI();

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
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: "abandonai-prod",
        Key: `audio/${hash}.mp3`,
      }),
    );
    return NextResponse.json({
      cache: true,
      source: `https://s3.abandon.ai/audio/${hash}.mp3`,
    });
  } catch (e) {
    console.log("NoSuchKey ");
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
    return NextResponse.json({
      source: `https://s3.abandon.ai/audio/${hash}.mp3`,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
