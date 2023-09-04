import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import ddbDocClient from "@/utils/ddbDocClient";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import snowflakeClient from "@/utils/snowflakeClient";
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
  const data = await ddbDocClient.send(
    new PutCommand({
      TableName: "abandonai-prod",
      Item: {
        PK: sub,
        SK: `PERSONA#${snowflakeClient.getUniqueID().toString()}`,
        p_name: "Tom",
        model: "gpt-3.5-turbo",
      },
    }),
  );

  return NextResponse.json({
    data,
  });
});

export { GET, POST };
