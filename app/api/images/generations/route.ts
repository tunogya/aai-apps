import s3Client from "@/app/utils/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import redisClient from "@/app/utils/redisClient";
import { sha256 } from "multiformats/hashes/sha2";
import { CID } from "multiformats/cid";
import * as raw from "multiformats/codecs/raw";
import getRateLimitConfig from "@/app/utils/getRateLimitConfig";
import openai from "@/app/utils/openai";
import stripeClient from "@/app/utils/stripeClient";

export const runtime = "edge";

// @ts-ignore
export async function POST(req: NextRequest): Promise<Response> {
  // @ts-ignore
  const { user } = await getSession();

  const customer = await redisClient.get(`customer:${user.email}`);

  if (!customer) {
    return NextResponse.json({
      error: "customer required",
      message: "You need to be a customer.",
    });
  }

  // @ts-ignore
  if (customer?.balance > 50) {
    return NextResponse.json(
      {
        error: "Insufficient balance",
        message: "You need to recharge before using it.",
      },
      {
        status: 402,
      },
    );
  }

  const prefix = "ratelimit:/api/images/generations:dalle3";
  const ratelimit = getRateLimitConfig(prefix);

  const { success, limit, reset, remaining } = await ratelimit.limit(
    user.email,
  );
  if (!success) {
    return new Response(
      JSON.stringify({
        error: 429,
        message: "ratelimit reached",
        ratelimit: {
          limit,
          reset,
          remaining,
        },
      }),
      {
        status: 429,
      },
    );
  }

  let { prompt, size, quality } = await req.json();

  quality = "standard";

  let cost;
  let baseRatio = 2;

  if (quality === "hd") {
    if (size === "1792x1024" || size === "1024x1792") {
      cost = 0.12 * baseRatio;
    } else {
      cost = 0.08 * baseRatio;
    }
  } else {
    if (size === "1792x1024" || size === "1024x1792") {
      cost = 0.08 * baseRatio;
    } else {
      cost = 0.04 * baseRatio;
    }
  }

  try {
    const model = "dall-e-3";
    const data = await openai.images.generate({
      prompt,
      n: 1,
      size,
      model,
      user: user.email,
      quality,
      response_format: "b64_json",
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
        // @ts-ignore
        stripeClient.customers.createBalanceTransaction(customer.id, {
          amount: Math.floor((cost || 0) * 100),
          currency: "usd",
        }),
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
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: e,
      },
      {
        status: 500,
      },
    );
  }
}
