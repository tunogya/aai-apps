import OpenAI from "openai";
import s3Client from "@/app/utils/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import redisClient from "@/app/utils/redisClient";
import { Ratelimit } from "@upstash/ratelimit";
import { sha256 } from "multiformats/hashes/sha2";
import { CID } from "multiformats/cid";
import * as raw from "multiformats/codecs/raw";
import getRateLimitConfig from "@/app/utils/getRateLimitConfig";

export const runtime = "edge";

const cache = new Map();

// @ts-ignore
export async function POST(req: NextRequest): Promise<Response> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  const premiumInfo = await redisClient.get(`premium:${sub}`);
  // @ts-ignore
  const isPremium = premiumInfo?.subscription?.isPremium || false;
  const product = isPremium
    ? // @ts-ignore
      premiumInfo?.subscription?.product
    : "AbandonAI Free";

  const prefix = "ratelimit:/api/images/generations:dalle3";
  const { ratelimit } = getRateLimitConfig(prefix, product);

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
    const image = data.data[0].b64_json;
    const revised_prompt = data.data[0].revised_prompt;
    if (image) {
      const buffer = Buffer.from(image, "base64");
      const uint8Array = new Uint8Array(buffer);
      const hash = await sha256.digest(uint8Array);
      const cid = CID.create(1, raw.code, hash).toString();

      const jsonBuffer = Buffer.from(JSON.stringify(data));
      await Promise.all([
        s3Client.send(
          new PutObjectCommand({
            Bucket: "abandonai-prod",
            Key: `images/${cid}`,
            Body: buffer,
            ContentType: "image/png",
          }),
        ),
        s3Client.send(
          new PutObjectCommand({
            Bucket: "abandonai-prod",
            Key: `images/${cid}.json`,
            Body: jsonBuffer,
            ContentType: "application/json",
          }),
        ),
      ]);

      return NextResponse.json(
        {
          revised_prompt: revised_prompt,
          url: `https://s3.abandon.ai/images/${cid}`,
        },
        {
          status: 200,
        },
      );
    }
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
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
