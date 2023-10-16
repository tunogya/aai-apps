import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import redisClient from "@/utils/redisClient";
import { v4 as uuidv4 } from "uuid";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const token = await redisClient.get(`${sub}:token`);
  if (!token) {
    return new Response("No tokens", {
      status: 404,
    });
  }
  return NextResponse.json({
    token,
  });
};

const POST = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  const oldToken = await redisClient.get(`${sub}:token`);
  if (oldToken) {
    await redisClient.del(`${oldToken}:sub`);
  }
  const token = "sk-" + uuidv4().replaceAll("-", "");
  await redisClient
    .multi()
    .set(`${sub}:token`, token)
    .set(`${token}:sub`, sub)
    .exec();

  return NextResponse.json({
    token,
  });
};

const DELETE = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  const oldToken = await redisClient.get(`${sub}:token`);
  if (oldToken) {
    await redisClient.del(`${oldToken}:sub`);
  }
  await redisClient.del(`${sub}:token`);
  return NextResponse.json({
    status: 200,
  });
};

export { GET, POST, DELETE };
