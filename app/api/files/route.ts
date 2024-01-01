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

  return NextResponse.json(
    {
      url,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=1",
        "CDN-Cache-Control": "public, s-maxage=60",
        "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
      },
    },
  );
}
