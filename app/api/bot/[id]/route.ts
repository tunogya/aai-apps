import { NextRequest, NextResponse } from "next/server";
import redisClient from "@/app/utils/redisClient";
import OpenAI from "openai";

const POST = async (req: NextRequest, { params }: any) => {
  const body = await req.json();

  const token = params.id;
  const assistant_id = await redisClient.get(`${token}:assistant_id`);
  if (!assistant_id) {
    return NextResponse.json(
      { message: "assistant_id not found" },
      { status: 404 },
    );
  }
  const openai = new OpenAI();
  const from_id = body?.message?.from?.id;

  let thread_id = await redisClient.get(
    `${assistant_id}:telegram:${from_id}:thread_id`,
  );

  if (!thread_id) {
    const { id } = await openai.beta.threads.create();
    thread_id = id;
    await redisClient.set(
      `${assistant_id}:telegram:${from_id}:thread_id`,
      thread_id,
    );
  }

  await openai.beta.threads.messages.create(thread_id as string, {
    role: "user",
    content: JSON.stringify(body),
  });

  return NextResponse.json({});
};

export { POST };
