import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";
import redisClient from "@/app/utils/redisClient";
import s3Client from "@/app/utils/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "edge";

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

  const formData = await req.formData();

  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      {
        error: "file required",
        message: "Please select a file to upload.",
      },
      {
        status: 400,
      },
    );
  }

  const hash = "";

  await s3Client.send(
    new PutObjectCommand({
      Bucket: "abandonai-prod",
      Key: `images/${hash}.png`,
      Body: file,
      ContentType: "image/png",
    }),
  );

  return NextResponse.json({
    url: `https://s3.abandon.ai/images/${hash}.png`,
  });
}
