import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse, NextRequest } from "next/server";
import ddbDocClient from "@/utils/ddbDocClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
const GET = withApiAuthRequired(async (req) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const limit = Number(req?.nextUrl?.searchParams?.get("limit") || 20);
  const { Items, Count } = await ddbDocClient.send(
    new QueryCommand({
      TableName: "abandonai-prod",
      KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
      ExpressionAttributeNames: {
        "#pk": "PK",
        "#sk": "SK",
      },
      ExpressionAttributeValues: {
        ":pk": sub,
        ":sk": "PERSONA#",
      },
      ScanIndexForward: false,
      ProjectionExpression: "PK, SK, title, created",
      Limit: limit,
    }),
  );

  return NextResponse.json({
    items: Items,
    count: Count,
  });
});

const POST = withApiAuthRequired(async (req) => {
  const session = await getSession();
  const sub = session?.user.sub;

  return NextResponse.json({});
});

export { GET, POST };
