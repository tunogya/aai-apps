import OpenAI from "openai";
import s3Client from "@/app/utils/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import dysortid from "@/app/utils/dysortid";

export const runtime = "edge";

// @ts-ignore
export async function POST(req: NextRequest): Promise<Response> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

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
