import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/utils/ddbDocClient";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const GET = withApiAuthRequired(async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const limit = Number(req?.nextUrl?.searchParams?.get("limit") || 20);
  try {
    const { Items, Count } = await ddbDocClient.send(
      new QueryCommand({
        TableName: "abandonai-dev",
        KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
        ProjectionExpression: "#pk, #sk, #name, #model, #description, #created",
        ExpressionAttributeNames: {
          "#pk": "PK",
          "#sk": "SK",
          "#name": "name",
          "#model": "model",
          "#description": "description",
          "#created": "created",
        },
        ExpressionAttributeValues: {
          ":pk": sub,
          ":sk": "PERSONA#",
        },
        Limit: limit,
      }),
    );
    return NextResponse.json({
      items: Items,
      count: Count,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "ddbDocClient error",
      },
      {
        status: 500,
      },
    );
  }
});

const POST = withApiAuthRequired(async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const { name, model, description } = await req.json();
  try {
    const item = {
      PK: sub,
      SK: `PERSONA#${uuidv4()}`,
      name,
      model,
      description,
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
