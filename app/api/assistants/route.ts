import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/app/utils/ddbDocClient";
import { BatchWriteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
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
    return NextResponse.json({
      items: Items,
      count: Count,
      nextCursor: LastEvaluatedKey?.SK.replace("ASST#", "") || undefined,
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
      PK: `USER#${sub}`,
      SK: `ASST#${newAssistant.id}`,
      id: newAssistant.id,
      created_at: newAssistant.created_at,
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
                  type: "assistant.post",
                  updated: Math.floor(Date.now() / 1000),
                  TTL: Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 365,
                },
              },
            },
          ],
        },
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
