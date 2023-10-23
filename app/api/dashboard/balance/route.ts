import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import ddbDocClient from "@/utils/ddbDocClient";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import redisClient from "@/utils/redisClient";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  const cache = await redisClient.get(`${sub}:balance`);
  const bonus = await redisClient.get(`${sub}:bonus`);

  if (cache) {
    return NextResponse.json({
      balance: (Number(cache) || 0) + (Number(bonus) || 0),
    });
  }

  try {
    const { Item } = await ddbDocClient.send(
      new GetCommand({
        TableName: "abandonai-prod",
        Key: {
          PK: `USER#${sub}`,
          SK: `BALANCE`,
        },
      }),
    );

    return NextResponse.json({
      balance: (Item?.balance || 0) + (Item?.bonus || 0),
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
