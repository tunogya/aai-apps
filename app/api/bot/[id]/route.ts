import { NextRequest, NextResponse } from "next/server";
import redisClient from "@/app/utils/redisClient";
import OpenAI from "openai";
import sqsClient from "@/app/utils/sqsClient";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

const POST = async (req: NextRequest, { params }: any) => {
  const body = await req.json();
  const token = params.id;
  console.log(body);
  // do not process groups, bots and old messages(24h)
  if (
    body?.message?.chat?.id < 0 ||
    body?.message?.from?.is_bot ||
    body?.message?.date < Math.floor(new Date().getTime() / 1000) - 24 * 60 * 60
  ) {
    return NextResponse.json({});
  }

  // Check assistant_id
  const assistant_id = await redisClient.get(`${token}:assistant_id`);
  if (!assistant_id) {
    return NextResponse.json(
      { message: "assistant_id not found" },
      { status: 404 },
    );
  }

  const openai = new OpenAI();
  const chat_id = body?.message?.chat?.id;

  // Check thread, if not exist, create
  let thread_id = await redisClient.get(
    `${assistant_id}:telegram:${chat_id}:thread_id`,
  );

  // Create new thread
  if (!thread_id || body?.message?.text?.trim() === "/start") {
    try {
      const { id } = await openai.beta.threads.create();
      thread_id = id;
      await redisClient.set(
        `${assistant_id}:telegram:${chat_id}:thread_id`,
        thread_id,
      );
      return NextResponse.json({
        thread_id,
        assistant_id,
        chat_id,
      });
    } catch (e) {
      console.log(e);
      return NextResponse.json(
        {
          error: true,
        },
        {
          status: 500,
        },
      );
    }
  }

  try {
    // Add messages to thread
    await openai.beta.threads.messages.create(thread_id as string, {
      role: "user",
      content: JSON.stringify(body),
    });

    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: process.env.AI_ASST_SQS_FIFO_URL,
        MessageBody: JSON.stringify({
          thread_id,
          assistant_id,
        }),
        MessageAttributes: {
          intent: {
            StringValue: "threads.runs.create",
            DataType: "String",
          },
          from: {
            StringValue: "telegram",
            DataType: "String",
          },
        },
        MessageDeduplicationId: `${assistant_id}-${thread_id}`,
        MessageGroupId: `${assistant_id}`,
      }),
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        error: true,
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({});
};

export { POST };
