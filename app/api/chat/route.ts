import {
  experimental_StreamData,
  OpenAIStream,
  StreamingTextResponse,
  Message,
} from "ai";
import OpenAI from "openai";
import { SendMessageBatchCommand, SQSClient } from "@aws-sdk/client-sqs";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import dysortid from "@/app/utils/dysortid";
import redisClient from "@/app/utils/redisClient";
import { Ratelimit } from "@upstash/ratelimit";

const sqsClient = new SQSClient({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const runtime = "edge";

const cache = new Map();

// @ts-ignore
export async function POST(req: NextRequest): Promise<Response> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  let { messages, model, id, functions } = await req.json();

  // get title before json parse messages content
  let title = messages[0]?.content.slice(0, 40);
  const useVision = model === "gpt-4-vision-preview";
  // prepare list_append before json parse messages content
  const list_append: Array<Message> = [];
  list_append.push({
    ...messages[messages.length - 1],
    id: dysortid(),
    createdAt: new Date(),
  });
  // json parse messages content, if (useVision === true)
  if (useVision) {
    for (let i = 0; i < messages.length; i++) {
      const item = messages[i];
      try {
        messages[i] = {
          ...item,
          content: JSON.parse(item.content),
        };
      } catch (e) {
        messages[i] = item;
      }
    }
    functions = undefined;
  }

  // only handle the last 6 messages
  messages?.slice(-6);

  let max_tokens = 1024;

  const isPremium = await redisClient.get(`premium:${sub}`);

  if (model?.startsWith("gpt-4")) {
    if (!isPremium) {
      return new Response(
        JSON.stringify({
          error: "premium required",
          message: "Sorry, you need a Premium subscription to use this.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
    const ratelimit = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(50, "3 h"),
      analytics: true,
      prefix: "ratelimit:/api/chat:gpt-4",
      ephemeralCache: cache,
    });
    const { success, limit, reset, remaining } = await ratelimit.limit(sub);
    if (!success) {
      return new Response(
        JSON.stringify({
          error: "limit reached",
          message: "Sorry, you have reached the limit. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "x-ratelimit-limit-requests": `${limit}`,
            "x-ratelimit-remaining-requests": `${remaining}`,
            "x-ratelimit-reset-requests": `${reset}`,
          },
        },
      );
    }
    max_tokens = 4096;
  } else {
    if (!isPremium) {
      const ratelimit = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(50, "1 h"),
        analytics: true,
        prefix: "ratelimit:/api/chat:gpt-3.5",
        ephemeralCache: cache,
      });
      const { success, limit, reset, remaining } = await ratelimit.limit(sub);
      if (!success) {
        return new Response(
          JSON.stringify({
            error: "limit reached",
            message:
              "Sorry, you have reached the limit. Please try again later.",
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "x-ratelimit-limit-requests": `${limit}`,
              "x-ratelimit-remaining-requests": `${remaining}`,
              "x-ratelimit-reset-requests": `${reset}`,
            },
          },
        );
      }
    }
  }

  const openai = new OpenAI();

  try {
    const res = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      stream: true,
      max_tokens,
      functions,
    });
    const data = new experimental_StreamData();
    const stream = OpenAIStream(res, {
      experimental_onFunctionCall: async () => {},
      async onCompletion(completion) {
        try {
          const { function_call } = JSON.parse(completion);
          const _name = function_call.name;
          list_append.push({
            id: dysortid(),
            createdAt: new Date(),
            role: "assistant",
            name: _name,
            content: "",
            function_call,
          });
        } catch (e) {
          list_append.push({
            id: dysortid(),
            createdAt: new Date(),
            role: "assistant",
            content: completion,
          });
        }
      },
      async onFinal(completion) {
        await sqsClient.send(
          new SendMessageBatchCommand({
            QueueUrl: process.env.AI_DB_UPDATE_SQS_FIFO_URL,
            Entries: [
              {
                Id: `chat_${id}_${new Date().getTime()}`,
                MessageBody: JSON.stringify({
                  TableName: "abandonai-prod",
                  Key: {
                    PK: `USER#${sub}`,
                    SK: `CHAT2#${id}`,
                  },
                  ExpressionAttributeNames: {
                    "#messages": "messages",
                    "#updated": "updated",
                    "#title": "title",
                  },
                  ExpressionAttributeValues: {
                    ":empty_list": [],
                    ":messages": list_append,
                    ":updated": Math.floor(Date.now() / 1000),
                    ":title": title,
                  },
                  UpdateExpression:
                    "SET #messages = list_append(if_not_exists(#messages, :empty_list), :messages), #updated = :updated, #title = :title",
                }),
                MessageAttributes: {
                  Command: {
                    DataType: "String",
                    StringValue: "UpdateCommand",
                  },
                },
                MessageGroupId: `chat_${id}`,
              },
            ],
          }),
        );
        await data.close();
      },
      experimental_streamData: true,
    });
    return new StreamingTextResponse(stream, {}, data);
  } catch (e) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: e,
      },
      {
        status: 500,
      },
    );
  }
}
