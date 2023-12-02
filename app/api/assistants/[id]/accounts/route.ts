import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import sqsClient from "@/app/utils/sqsClient";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

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
      },
      {
        status: 500,
      },
    );
  }
};

export { PATCH };
