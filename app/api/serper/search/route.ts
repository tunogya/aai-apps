import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import redisClient from "@/app/utils/redisClient";

export const runtime = "edge";

// @ts-ignore
export async function POST(req: NextRequest): Promise<NextResponse> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  const [customer, subscription] = await Promise.all([
    redisClient.get(`customer:${sub}`),
    redisClient.get(`subscription:${sub}`),
  ]);

  if (!customer || !subscription) {
    return NextResponse.json({
      error: "customer and subscription required",
      message: "You need to be a customer and a subscription.",
    });
  }

  let { q, num = 10 } = await req.json();

  try {
    const data = await fetch(`https://google.serper.dev/search`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.SERPER_API_KEY!,
      },
      body: JSON.stringify({
        q,
        num,
      }),
    }).then((res) => res.json());

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=1",
        "CDN-Cache-Control": "public, s-maxage=60",
        "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
      },
    });
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
