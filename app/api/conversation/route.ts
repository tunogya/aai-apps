import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/app/utils/ddbDocClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

// No need to use Redis
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
        "#updated": "updated",
        "#title": "title",
      },
      ExpressionAttributeValues: {
        ":pk": `USER#${sub}`,
        ":sk": "CHAT2#",
      },
      Limit: limit,
      ScanIndexForward: false,
      ExclusiveStartKey: cursor
        ? {
            PK: `USER#${sub}`,
            SK: `CHAT2#${cursor}`,
          }
        : undefined,
      ProjectionExpression: "#updated, #title, #pk, #sk",
    }),
  );
  return NextResponse.json({
    items: Items,
    count: Count,
    nextCursor: LastEvaluatedKey?.SK.replace("CHAT2#", "") || undefined,
  });
};

export { GET };
