import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import redisClient from "@/app/utils/redisClient";

const GET = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;
  const premiumInfo = await redisClient.get(`premium:${sub}`);

  return NextResponse.json({
    error: "something went wrong",
  });
};

export { GET };
