import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";
import redisClient from "@/utils/redisClient";

export const runtime = "edge";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  const [cache, bonus, credit] = await redisClient.mget(
    `${sub}:balance`,
    `${sub}:bonus`,
    `${sub}:credit`,
  );

  return NextResponse.json({
    balance: (Number(cache) || 0) + (Number(bonus) || 0),
    credit: credit || 0,
  });
};

export { GET };
