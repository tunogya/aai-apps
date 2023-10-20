import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/utils/ddbDocClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import redisClient from "@/utils/redisClient";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const limit = Number(req?.nextUrl?.searchParams?.get("limit") || 20);
  const cursor = req?.nextUrl?.searchParams?.get("cursor") || undefined;

  const cache = await redisClient.get(`usage:${sub}:${limit}:${cursor}`);
  if (cache) {
    return NextResponse.json(cache);
  }

  const { Items, Count, LastEvaluatedKey } = await ddbDocClient.send(
    new QueryCommand({
      TableName: "abandonai-prod",
      KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
      ExpressionAttributeNames: {
        "#pk": "PK",
        "#sk": "SK",
      },
      ExpressionAttributeValues: {
        ":pk": `USER#${sub}`,
        ":sk": "USAGE#",
      },
      Limit: limit,
      ScanIndexForward: false,
      ProjectionExpression:
        "model, prompt_tokens, completion_tokens, total_cost, created",
      ExclusiveStartKey: cursor
        ? {
            PK: `USER#${sub}`,
            SK: `USAGE#${cursor}`,
          }
        : undefined,
    }),
  );

  const data = {
    items: Items,
    count: Count,
    nextCursor: LastEvaluatedKey?.SK.replace("USAGE#", "") || undefined,
  };

  await redisClient.set(
    `usage:${sub}:${limit}:${cursor}`,
    JSON.stringify(data),
    {
      ex: 60,
    },
  );

  return NextResponse.json(data);
};

export { GET };
