import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import redisClient from "@/utils/redisClient";
import { roundUp } from "@/utils/roundUp";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayStr = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [today, yesterday] = await redisClient.mget(
    `${sub}:total_cost:${todayStr}`,
    `${sub}:total_cost:${yesterdayStr}`,
  );

  return NextResponse.json({
    today: roundUp(Number(today), 6) || 0,
    yesterday: roundUp(Number(yesterday), 6) || 0,
  });
};

export { GET };
