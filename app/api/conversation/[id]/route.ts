import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/app/utils/ddbDocClient";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import sqsClient from "@/app/utils/sqsClient";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

const GET = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;
  try {
    const { Item } = await ddbDocClient.send(
      new GetCommand({
        TableName: "abandonai-prod",
        Key: {
          PK: `USER#${sub}`,
          SK: `CHAT2#${params?.id}`,
        },
      }),
    );
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

const DELETE = async (req: NextRequest, { params }: any) => {
  const session = await getSession();
  const sub = session?.user.sub;
  try {
    const result = await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: process.env.AI_DB_UPDATE_SQS_FIFO_URL,
        MessageBody: JSON.stringify({
          TableName: "abandonai-prod",
          Key: {
            PK: `USER#${sub}`,
            SK: `CHAT2#${params?.id}`,
          },
        }),
        MessageAttributes: {
          Command: {
            DataType: "String",
            StringValue: "DeleteCommand",
          },
        },
        MessageGroupId: `chat_${params.id}`,
      }),
    );
    return NextResponse.json({
      delete: true,
      message: result,
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
    const result = await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: process.env.AI_DB_UPDATE_SQS_FIFO_URL,
        MessageBody: JSON.stringify({
          TableName: "abandonai-prod",
          Key: {
            PK: `USER#${sub}`,
            SK: `CHAT2#${params?.id}`,
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
        MessageGroupId: `chat_${params.id}`,
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
      },
      {
        status: 500,
      },
    );
  }
};

export { GET, DELETE, PATCH };
