import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/utils/ddbDocClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const limit = Number(req?.nextUrl?.searchParams?.get("limit") || 20);
  const cursor = req?.nextUrl?.searchParams?.get("cursor") || undefined;
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
  return NextResponse.json({
    items: Items,
    count: Count,
    nextCursor: LastEvaluatedKey?.SK.replace("USAGE#", "") || undefined,
  });
};

export { GET };
