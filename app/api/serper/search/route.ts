import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import redisClient from "@/app/utils/redisClient";
import ddbDocClient from "@/app/utils/ddbDocClient";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const runtime = "edge";

// @ts-ignore
export async function POST(req: NextRequest): Promise<NextResponse> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  const cache = await redisClient.get(`premium:${sub}`);
  // @ts-ignore
  const isPremium = cache?.subscription?.isPremium || false;

  if (!isPremium) {
    return NextResponse.json(
      {
        error: "premium required",
        message: "Sorry, you need a Premium subscription to use this.",
      },
      {
        status: 200,
      },
    );
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

    let cost,
      baseRatio = 2;
    if (num > 10) {
      cost = 0.001 * 2 * baseRatio;
    } else {
      cost = 0.001 * baseRatio;
    }

    await ddbDocClient.send(
      new UpdateCommand({
        TableName: "abandonai-prod",
        Key: {
          PK: `CHARGES#${new Date()
            .toISOString()
            .slice(0, 8)
            .replaceAll("-", "")}`,
          SK: `EMAIL#${user.email}`,
        },
        UpdateExpression: `ADD billing :cost, #model_count :count, #model_cost :cost`,
        ExpressionAttributeValues: {
          ":cost": cost,
          ":count": 1,
        },
        ExpressionAttributeNames: {
          "#model_count": `search_count`,
          "#model_cost": `search_cost`,
        },
      }),
    );

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
