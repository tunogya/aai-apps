import OpenAI from "openai";
import s3Client from "@/app/utils/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import dysortid from "@/app/utils/dysortid";
import redisClient from "@/app/utils/redisClient";
import { Ratelimit } from "@upstash/ratelimit";

export const runtime = "edge";

const cache = new Map();

// @ts-ignore
export async function POST(req: NextRequest): Promise<Response> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  const isPremium = await redisClient.get(`premium:${sub}`);

  if (!isPremium) {
    return new Response(
      JSON.stringify({
        error: "premium required",
        message: "Sorry, you need a Premium subscription to use this.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const ratelimit = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(1, "1 m"),
    analytics: true,
    prefix: "ratelimit:/api/images/generations:dalle3",
    ephemeralCache: cache,
  });
  const { success, limit, reset, remaining } = await ratelimit.limit(sub);
  if (!success) {
    return new Response(
      JSON.stringify({
        error: "limit reached",
        message: "Sorry, you have reached the limit. Please try again later.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "x-ratelimit-limit-requests": `${limit}`,
          "x-ratelimit-remaining-requests": `${remaining}`,
          "x-ratelimit-reset-requests": `${reset}`,
        },
      },
    );
  }

  let { prompt, size } = await req.json();

  const openai = new OpenAI();

  try {
    const data = await openai.images.generate({
      prompt,
      n: 1,
      size,
      model: "dall-e-3",
      response_format: "b64_json",
      user: sub,
    });
    const hash = dysortid();
    const image = data.data[0].b64_json;
    const revised_prompt = data.data[0].revised_prompt;
    if (image) {
      const buffer = Buffer.from(image, "base64");
      const jsonBuffer = Buffer.from(JSON.stringify(data));
      await Promise.all([
        s3Client.send(
          new PutObjectCommand({
            Bucket: "abandonai-prod",
            Key: `images/${hash}.png`,
            Body: buffer,
            ContentType: "image/png",
          }),
        ),
        s3Client.send(
          new PutObjectCommand({
            Bucket: "abandonai-prod",
            Key: `images/${hash}.json`,
            Body: jsonBuffer,
            ContentType: "application/json",
          }),
        ),
      ]);
    }

    return NextResponse.json(
      {
        revised_prompt: revised_prompt,
        url: `https://s3.abandon.ai/images/${hash}.png`,
      },
      {
        status: 200,
      },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
