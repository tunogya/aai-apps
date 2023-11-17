import OpenAI from "openai";
import { nanoid } from "ai";
import s3Client from "@/app/utils/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "@auth0/nextjs-auth0/edge";

export const runtime = "edge";

// @ts-ignore
export async function POST(req: Request): Promise<Response> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  let { prompt, size } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const data = await openai.images.generate({
      prompt,
      n: 1,
      size,
      model: "dall-e-3",
      response_format: "b64_json",
      user: sub,
    });
    const hash = nanoid();
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

    return new Response(
      JSON.stringify({
        revised_prompt: revised_prompt,
        url: `https://s3.abandon.ai/images/${hash}.png`,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (e) {
    console.log(e);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
