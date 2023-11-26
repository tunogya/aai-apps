import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/app/utils/ddbDocClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import sqsClient from "@/app/utils/sqsClient";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import OpenAI from "openai";

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
    const openai = new OpenAI();
    const newAssistant = await openai.beta.assistants.create({
      instructions,
      name,
      description,
      tools: [],
      model,
      metadata,
    });
    const item = {
      ...newAssistant,
      PK: `USER#${sub}`,
      SK: `ASST#${newAssistant.id}`,
    };
    const result = await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: process.env.AI_DB_UPDATE_SQS_URL,
        MessageBody: JSON.stringify({
          TableName: "abandonai-prod",
          Item: item,
          ConditionExpression:
            "attribute_not_exists(PK) AND attribute_not_exists(SK)",
        }),
        MessageAttributes: {
          Command: {
            DataType: "String",
            StringValue: "PutCommand",
          },
        },
      }),
    );
    return NextResponse.json({
      success: true,
      item,
      message: result,
    });
  } catch (e) {
    return NextResponse.json({
      error: "ddbDocClient error",
    });
  }
};

export { GET, POST };
