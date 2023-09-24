import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { AI_MODELS_MAP } from "@/utils/aiModels";
import { Ratelimit } from "@upstash/ratelimit";
import redisClient from "@/utils/redisClient";

const sqsClient = new SQSClient({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// @ts-ignore
export async function POST(req: Request): Promise<Response> {
  const { messages, model, sub } = await req.json();
  if (!AI_MODELS_MAP.has(model)) {
    return new Response(
      `Invalid model, expected one of ${Array.from(AI_MODELS_MAP.keys()).join(
        ", ",
      )}`,
      {
        status: 400,
      },
    );
  }

  if (process.env.NODE_ENV != "development") {
    const ratelimit = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
      timeout: 1000,
      prefix: "ratelimit#chat",
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `${sub}`,
    );

    if (!success) {
      return new Response(
        "You have reached your request limit for the minute.",
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }
  }

  try {
    const res = await openai.createChatCompletion({
      model,
      messages,
      temperature: 0.7,
      stream: true,
      max_tokens: 500,
    });

    const stream = OpenAIStream(res, {
      onCompletion(completion) {
        // record usage log and reduce the balance of user
        sqsClient.send(
          new SendMessageCommand({
            QueueUrl: process.env.AI_DB_UPDATE_SQS_URL,
            MessageBody: JSON.stringify({
              TableName: "abandonai-prod",
              Item: {
                PK: `USER#${sub}`,
                SK: `USAGE#${new Date().toISOString()}`,
                prompt: messages,
                completion,
                model,
                created: Math.floor(Date.now() / 1000),
                TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 12, // 12 month
              },
              ConditionExpression: "attribute_not_exists(#PK)",
              ExpressionAttributeNames: {
                "#PK": "PK",
              },
            }),
            MessageAttributes: {
              Command: {
                DataType: "String",
                StringValue: "PutCommand",
              },
            },
          }),
        );
      },
    });

    return new StreamingTextResponse(stream);
  } catch (e) {
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
