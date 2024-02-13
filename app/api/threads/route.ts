import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import ddbDocClient from "@/app/utils/ddbDocClient";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import openai from "@/app/utils/openai";
import redisClient from "@/app/utils/redisClient";
import jwt from "jsonwebtoken";
import AUTH0_CERT from "@/app/utils/cert";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  let sub = session?.user.sub;
  if (!sub) {
    let token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json(
        {
          error: "auth error",
        },
        {
          status: 500,
        },
      );
    }
    token = token.split(" ")[1];
    const decodedToken = jwt.verify(token, AUTH0_CERT, {
      algorithms: ["RS256"],
    });
    sub = decodedToken.sub;
  }

  const limit = Number(req?.nextUrl?.searchParams?.get("limit") || 20);
  const cursor = req?.nextUrl?.searchParams?.get("cursor") || undefined;
  try {
    const { Items, Count, LastEvaluatedKey } = await ddbDocClient.send(
      new QueryCommand({
        TableName: "abandonai-prod",
        KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
        ExpressionAttributeValues: {
          ":pk": `USER#${sub}`,
          ":sk": "THREAD#",
        },
        ExpressionAttributeNames: {
          "#pk": "PK",
          "#sk": "SK",
        },
        Limit: limit,
        ScanIndexForward: false,
        ExclusiveStartKey: cursor
          ? {
              PK: `USER#${sub}`,
              SK: `THREAD#${cursor}`,
            }
          : undefined,
      }),
    );
    return NextResponse.json({
      items: Items,
      count: Count,
      nextCursor: LastEvaluatedKey?.SK.replace("THREAD#", "") || undefined,
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
};

const POST = async (req: NextRequest) => {
  const session = await getSession();
  const { messages, metadata } = await req.json();

  let sub = session?.user.sub;
  if (!sub) {
    // get from header Authorization
    let token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json(
        {
          error: "auth error",
        },
        {
          status: 500,
        },
      );
    }
    token = token.split(" ")[1];
    const decodedToken = jwt.verify(token, AUTH0_CERT, {
      algorithms: ["RS256"],
    });
    sub = decodedToken.sub;
  }

  try {
    const newThread = await openai.beta.threads.create({
      messages,
      metadata,
    });

    await redisClient.set(`THREAD#${newThread.id}`, JSON.stringify(newThread));
    await ddbDocClient.send(
      new PutCommand({
        TableName: "abandonai-prod",
        Item: {
          ...newThread,
          PK: `USER#${sub}`,
          SK: `THREAD#${newThread.id}`,
        },
        ConditionExpression:
          "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      }),
    );
    return NextResponse.json({
      success: true,
      item: newThread,
    });
  } catch (e) {
    return NextResponse.json({
      error: "ddbDocClient error",
    });
  }
};

export { GET, POST };
