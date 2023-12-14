import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import redisClient from "@/app/utils/redisClient";
import s3Client from "@/app/utils/s3Client";
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { sha256 } from "multiformats/hashes/sha2";
import { CID } from "multiformats/cid";
import * as raw from "multiformats/codecs/raw";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  let isPremium, product;
  try {
    const premiumInfo = await redisClient.get(`premium:${sub}`);
    // @ts-ignore
    isPremium = premiumInfo?.subscription?.isPremium;
  } catch (e) {
    isPremium = false;
    product = null;
  }

  if (!isPremium) {
    return NextResponse.json({
      error: "premium required",
      message: "Sorry, you need a Premium subscription to use this.",
    });
  }

  if (!req.body) {
    return NextResponse.json(
      {
        error: "file required",
        message: "Please use form data, file: {file}",
      },
      {
        status: 400,
      },
    );
  }

  let file;
  try {
    const formData = await req.formData();
    file = formData.get("file") as File;
  } catch (e) {
    return NextResponse.json(
      {
        error: "file required",
        message: "Please use form data, file: {file}",
      },
      {
        status: 400,
      },
    );
  }

  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);
  const hash = await sha256.digest(uint8Array);
  const cid = CID.create(1, raw.code, hash).toString();

  const url = `https://s3.abandon.ai/files/${cid}`;

  // try if file exists
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: "abandonai-prod",
        Key: `files/${cid}`,
      }),
    );
    return NextResponse.json({
      cache: true,
      url,
    });
  } catch (e) {
    console.log(e);
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: "abandonai-prod",
      Key: `files/${cid}`,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    }),
  );

  return NextResponse.json({
    url,
  });
}
