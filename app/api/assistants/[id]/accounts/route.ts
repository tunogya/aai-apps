import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import sqsClient from "@/app/utils/sqsClient";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import ddbDocClient from "@/app/utils/ddbDocClient";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import redisClient from "@/app/utils/redisClient";

const GET = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;
  try {
    const { Item: asst } = await ddbDocClient.send(
      new GetCommand({
        TableName: "abandonai-prod",
        Key: {
          PK: `USER#${sub}`,
          SK: `ASST#${params?.id}`,
        },
      }),
    );
    if (!asst) {
      return NextResponse.json(
        {
          error: "assistant not found",
        },
        {
          status: 404,
        },
      );
    }
    const { Item } = await ddbDocClient.send(
      new GetCommand({
        TableName: "abandonai-prod",
        Key: {
          PK: `ASST#${params?.id}`,
          SK: "ACCOUNT",
        },
      }),
    );
    if (Item?.telegram) {
      const { token, webhook } = Item.telegram;
      await redisClient.set(webhook, token);
    }
    return NextResponse.json({
      item: Item,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "something went wrong",
      },
      {
        status: 500,
      },
    );
  }
};

const PATCH = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression,
  } = await req.json();
  try {
    const { Item: asst } = await ddbDocClient.send(
      new GetCommand({
        TableName: "abandonai-prod",
        Key: {
          PK: `USER#${sub}`,
          SK: `ASST#${params?.id}`,
        },
      }),
    );
    if (!asst) {
      return NextResponse.json(
        {
          error: "assistant not found",
        },
        {
          status: 404,
        },
      );
    }
    const result = await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: process.env.AI_DB_UPDATE_SQS_FIFO_URL,
        MessageBody: JSON.stringify({
          TableName: "abandonai-prod",
          Key: {
            PK: `ASST#${params?.id}`,
            SK: `ACCOUNT`,
          },
          UpdateExpression: UpdateExpression || undefined,
          ExpressionAttributeNames: ExpressionAttributeNames || undefined,
          ExpressionAttributeValues: ExpressionAttributeValues || undefined,
          ConditionExpression: ConditionExpression || undefined,
        }),
        MessageAttributes: {
          Command: {
            DataType: "String",
            StringValue: "UpdateCommand",
          },
        },
        MessageGroupId: `account_${params.id}`,
      }),
    );
    return NextResponse.json({
      updated: true,
      message: result,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "something went wrong",
        message: e,
      },
      {
        status: 500,
      },
    );
  }
};

export { GET, PATCH };
