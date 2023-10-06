import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { SendMessageBatchCommand, SQSClient } from "@aws-sdk/client-sqs";
import redisClient from "@/utils/redisClient";
import { v4 as uuidv4 } from "uuid";

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
  organization: process.env.OPENAI_ORG_ID,
});

const openai = new OpenAIApi(configuration);

// @ts-ignore
export async function POST(req: Request): Promise<Response> {
  let { messages, model, sub, id } = await req.json();
  const balance = ((await redisClient.get(`${sub}:balance`)) as number) || 0;
  if (balance < -0.1) {
    return new Response("Not enough balance", {
      status: 401,
    });
  }

  messages.slice(-8);

  if (model === "GPT-3.5") {
    if (messages.length > 4) {
      model = "gpt-3.5-turbo-16k";
    } else {
      model = "gpt-3.5-turbo";
    }
  } else if (model === "GPT-4") {
    model = "gpt-4";
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
          new SendMessageBatchCommand({
            QueueUrl: process.env.AI_DB_UPDATE_SQS_FIFO_URL,
            Entries: [
              {
                Id: `update-usage-${id}-${new Date().getTime()}`,
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
                MessageGroupId: "update-usage",
              },
              {
                Id: `update-chat-${id}-${new Date().getTime()}`,
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
                    ":messages": [
                      {
                        ...messages[messages.length - 1],
                        id: uuidv4(),
                        createdAt: new Date(),
                      },
                      {
                        id: uuidv4(),
                        createdAt: new Date(),
                        role: "assistant",
                        content: completion,
                      },
                    ],
                    ":updated": Math.floor(Date.now() / 1000),
                    ":title": messages[0]?.text?.slice(0, 20) || "Title",
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
                MessageGroupId: "update-chat",
              },
            ],
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
