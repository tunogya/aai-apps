import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/utils/ddbDocClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import redisClient from "@/utils/redisClient";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const limit = Number(req?.nextUrl?.searchParams?.get("limit") || 20);
  const page = Number(req?.nextUrl?.searchParams?.get("page") || 0);
  let exclusiveStartKey = undefined;
  if (page >= 1) {
    exclusiveStartKey = await redisClient.get(`${sub}#UASGE#P${page}`);
    if (!exclusiveStartKey) {
      return NextResponse.json({
        items: [],
        count: 0,
      });
    }
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
      ExclusiveStartKey: exclusiveStartKey,
    }),
  );
  if (LastEvaluatedKey) {
    await redisClient.set(`${sub}#UASGE#P${page + 1}`, LastEvaluatedKey, {
      ex: 60 * 60 * 24,
    });
  }
  return NextResponse.json({
    items: Items,
    count: Count,
  });
};

export { GET };
