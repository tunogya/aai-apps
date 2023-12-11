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
  let isVision = false;
  try {
    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];
    const content = currentMessage.content;
    const json = JSON.parse(content);

    model = "gpt-4-vision-preview";
    isVision = true;
    messages = [
      ...initialMessages,
      {
        ...currentMessage,
        content: json,
      },
    ];
    // @dev gpt-4-vision-preview do not support functions, https://platform.openai.com/docs/guides/vision
    //
    //  messages=[
    //     {
    //       "role": "user",
    //       "content": [
    //         {"type": "text", "text": "What’s in this image?"},
    //         {
    //           "type": "image_url",
    //           "image_url": {
    //             "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
    //           },
    //         },
    //       ],
    //     }
    //   ],
    functions = undefined;
  } catch (e) {
    console.log(e);
  }

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
    messages?.slice(-8);
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

    messages?.slice(-8);
  }

  const openai = new OpenAI();

  const list_append: Array<Message> = [];
  if (isVision) {
    list_append.push({
      id: dysortid(),
      createdAt: new Date(),
      content: JSON.stringify(messages[messages.length - 1].content),
      role: messages[messages.length - 1].role,
    });
  } else {
    list_append.push({
      ...messages[messages.length - 1],
      id: dysortid(),
      createdAt: new Date(),
    });
  }

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
        let title;
        if (isVision) {
          title = JSON.stringify(messages[0]?.content).slice(0, 40);
        } else {
          title = messages[0]?.content.slice(0, 40);
        }

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
