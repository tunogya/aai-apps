import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/utils/ddbDocClient";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const GET = withApiAuthRequired(async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const limit = Number(req?.nextUrl?.searchParams?.get("limit") || 20);
  const { Items, Count } = await ddbDocClient.send(
    new QueryCommand({
      TableName: "abandonai-dev",
      KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
      ExpressionAttributeNames: {
        "#pk": "PK",
        "#sk": "SK",
      },
      ExpressionAttributeValues: {
        ":pk": sub,
        ":sk": "USAGE#",
      },
      Limit: limit,
    }),
  );
  return NextResponse.json({
    items: Items,
    count: Count,
  });
});

const POST = withApiAuthRequired(async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const {} = await req.json();
  try {
    const item = {
      PK: sub,
      SK: `USAGE#${uuidv4()}`,
      created: Math.floor(Date.now() / 1000),
    };
    await ddbDocClient.send(
      new PutCommand({
        TableName: "abandonai-dev",
        Item: item,
      }),
    );
    return NextResponse.json({
      success: true,
      item,
    });
  } catch (e) {
    return NextResponse.json({
      error: "ddbDocClient error",
    });
  }
});

export { GET, POST };
