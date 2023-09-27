import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import redisClient from "@/utils/redisClient";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;
  try {
    const balance = (await redisClient.get(`${sub}:balance`)) || 0;
    return NextResponse.json({
      balance: balance,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
};

export { GET };
