import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/app/utils/ddbDocClient";
import {
  BatchWriteCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import redisClient from "@/app/utils/redisClient";
import openai from "@/app/utils/openai";
import dysortid from "@/app/utils/dysortid";

// No need to use Redis
const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const limit = Number(req?.nextUrl?.searchParams?.get("limit") || 20);
  const cursor = req?.nextUrl?.searchParams?.get("cursor") || undefined;
  try {
    const { Items, Count, LastEvaluatedKey } = await ddbDocClient.send(
      new QueryCommand({
        TableName: "abandonai-prod",
        KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
        ExpressionAttributeValues: {
          ":pk": `USER#${sub}`,
          ":sk": "ASST#",
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
              SK: `ASST#${cursor}`,
            }
          : undefined,
      }),
    );
    return NextResponse.json(
      {
        items: Items,
        count: Count,
        nextCursor: LastEvaluatedKey?.SK.replace("ASST#", "") || undefined,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1",
          "CDN-Cache-Control": "public, s-maxage=60",
          "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
        },
      },
    );
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
  const sub = session?.user.sub;
  const { name, description, instructions, metadata, model } = await req.json();
  try {
    const newAssistant = await openai.beta.assistants.create({
      instructions,
      name,
      description,
      model,
      metadata,
    });
    const item = {
      ...newAssistant,
      PK: `USER#${sub}`,
      SK: `ASST#${newAssistant.id}`,
    };

    // Add to Redis
    await redisClient.set(`ASST#${newAssistant.id}`, JSON.stringify(item));
    const uniqueId = dysortid();
    await ddbDocClient.send(
      new BatchWriteCommand({
        RequestItems: {
          "abandonai-prod": [
            {
              PutRequest: {
                Item: item,
              },
            },
            {
              PutRequest: {
                Item: {
                  PK: `ASST#${newAssistant.id}`,
                  SK: `EVENT#${uniqueId}`,
                  data: item,
                  type: "assistant.post",
                  updated: Math.floor(Date.now() / 1000),
                },
              },
            },
          ],
        },
      }),
    );
    await ddbDocClient.send(
      new PutCommand({
        TableName: "abandonai-prod",
        Item: item,
        ConditionExpression:
          "attribute_not_exists(PK) AND attribute_not_exists(SK)",
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
};

export { GET, POST };
