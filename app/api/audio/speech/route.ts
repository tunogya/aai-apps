import s3Client from "@/app/utils/s3Client";
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import redisClient from "@/app/utils/redisClient";
import { CID } from "multiformats/cid";
import * as json from "multiformats/codecs/json";
import { sha256 } from "multiformats/hashes/sha2";
import openai from "@/app/utils/openai";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // @ts-ignore
  const { user } = await getSession();

  const [customer, subscription] = await Promise.all([
    redisClient.get(`customer:${user.email}`),
    redisClient.get(`subscription:${user.email}`),
  ]);

  if (!customer || !subscription) {
    return NextResponse.json({
      error: "customer and subscription required",
      message: "You need to be a customer and a subscription.",
    });
  }

  let { model, input, voice, response_format, speed } = await req.json();

  const bytes = json.encode({
    model,
    input,
    voice,
    response_format,
    speed,
  });
  const hash = await sha256.digest(bytes);
  const cid = CID.create(1, json.code, hash).toString();

  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: "abandonai-prod",
        Key: `audio/${cid}.mp3`,
      }),
    );
    return NextResponse.json({
      cache: true,
      url: `https://s3.abandon.ai/audio/${cid}.mp3`,
    });
  } catch (e) {
    console.log("NoSuchKey:", `audio/${cid}.mp3`);
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

      let cost,
        baseRatio = 2;
      if (model === "tts-1-hd") {
        cost = (0.03 * input.length * baseRatio) / 1000;
      } else {
        cost = (0.015 * input.length * baseRatio) / 1000;
      }

      await Promise.all([
        s3Client.send(
          new PutObjectCommand({
            Bucket: "abandonai-prod",
            Key: `audio/${cid}.mp3`,
            Body: buffer,
            ContentType: "audio/mpeg",
          }),
        ),
        s3Client.send(
          new PutObjectCommand({
            Bucket: "abandonai-prod",
            Key: `audio/${cid}`,
            Body: jsonBuffer,
            ContentType: "application/json",
          }),
        ),
      ]);
    } catch (e) {
      console.log(e);
    }
    return NextResponse.json(
      {
        url: `https://s3.abandon.ai/audio/${cid}.mp3`,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1",
          "CDN-Cache-Control": "public, s-maxage=60",
          "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
        },
      },
    );
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
