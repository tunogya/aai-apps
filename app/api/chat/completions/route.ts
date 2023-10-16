import { Configuration, OpenAIApi } from "openai-edge";
import { SendMessageBatchCommand, SQSClient } from "@aws-sdk/client-sqs";
import redisClient from "@/utils/redisClient";
import { AI_MODELS_MAP } from "@/utils/aiModels";
import { OpenAIStream, StreamingTextResponse } from "ai";

const sqsClient = new SQSClient({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const runtime = "edge";

const FEE_RATE = 0.3;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

const openai = new OpenAIApi(configuration);

// @ts-ignore
export async function POST(req: Request): Promise<Response> {
  const bearerToken = req.headers.get("Authorization");
  if (!bearerToken) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const token = bearerToken.split(" ")[1];

  const sub = (await redisClient.get(`${token}:sub`)) as string;
  if (!sub) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const balance = ((await redisClient.get(`${sub}:balance`)) as number) || 0;
  if (balance < -0.1) {
    return new Response("Not enough balance", {
      status: 401,
    });
  }

  const config = await req.json();

  try {
    if (config?.stream) {
      const res = await openai.createChatCompletion(config);
      const stream = OpenAIStream(res, {
        onCompletion(completion) {
          // record usage log and reduce the balance of user
          sqsClient.send(
            new SendMessageBatchCommand({
              QueueUrl: process.env.AI_DB_UPDATE_SQS_FIFO_URL,
              Entries: [
                {
                  Id: `update-usage-${new Date().getTime()}`,
                  MessageBody: JSON.stringify({
                    TableName: "abandonai-prod",
                    Item: {
                      PK: `USER#${sub}`,
                      SK: `USAGE#${new Date().toISOString()}`,
                      prompt: config.messages,
                      completion,
                      model: config.model,
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
                  MessageGroupId: "update-usage",
                },
              ],
            }),
          );
        },
      });

      return new StreamingTextResponse(stream);
    } else {
      const res = await openai
        .createChatCompletion(config)
        .then((res) => res.json());

      const id = res.id;
      const { prompt_tokens, completion_tokens, total_tokens } = res.usage;

      const prompt_cost = roundUp(
        (prompt_tokens / 1000) * AI_MODELS_MAP.get(config.model)!.input_price,
        6,
      );
      const completion_cost = roundUp(
        (completion_tokens / 1000) *
          AI_MODELS_MAP.get(config.model)!.output_price,
        6,
      );
      const fee_cost = roundUp((prompt_cost + completion_cost) * FEE_RATE, 6);
      const total_cost = roundUp(prompt_cost + completion_cost + fee_cost, 6);

      await sqsClient.send(
        new SendMessageBatchCommand({
          QueueUrl: process.env.AI_DB_UPDATE_SQS_FIFO_URL,
          Entries: [
            {
              Id: `update-usage-${new Date().getTime()}`,
              MessageBody: JSON.stringify({
                TableName: "abandonai-prod",
                Item: {
                  PK: `USER#${sub}`,
                  SK: `USAGE#${new Date().toISOString()}`,
                  model: config.model,
                  prompt_tokens,
                  completion_tokens,
                  total_tokens,
                  fee_cost,
                  prompt_cost,
                  completion_cost,
                  total_cost,
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
              MessageGroupId: "update-usage",
            },
            {
              Id: `${id}-update-balance`,
              MessageBody: JSON.stringify({
                TableName: "abandonai-prod",
                Key: {
                  PK: `USER#${sub}`,
                  SK: "BALANCE",
                },
                UpdateExpression: "ADD #balance :total_cost",
                ExpressionAttributeNames: {
                  "#balance": "balance",
                },
                ExpressionAttributeValues: {
                  ":total_cost": -1 * total_cost,
                },
              }),
              MessageAttributes: {
                Command: {
                  DataType: "String",
                  StringValue: "UpdateCommand",
                },
              },
              MessageDeduplicationId: `${id}-update-balance`,
              MessageGroupId: "update-balance",
            },
          ],
        }),
      );

      return new Response(JSON.stringify(res), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (e) {
    console.log(e);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

function roundUp(num: number, decimals: number): number {
  const pow = Math.pow(10, decimals);
  return Math.ceil(num * pow) / pow;
}
