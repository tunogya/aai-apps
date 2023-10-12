import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import redisClient from "@/utils/redisClient";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { SendMessageBatchCommand, SQSClient } from "@aws-sdk/client-sqs";
import { ChatCompletionRequestMessage } from "openai-edge/types/api";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

const sqsClient = new SQSClient({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request): Promise<Response> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;
  const balance = ((await redisClient.get(`${sub}:balance`)) as number) || 0;
  if (balance < -0.1) {
    return new Response("Not enough balance", {
      status: 401,
    });
  }
  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      "Missing OPENAI_API_KEY – make sure to add it to your .env file.",
      {
        status: 400,
      },
    );
  }

  let { prompt } = await req.json();

  const messages: Array<ChatCompletionRequestMessage> = [
    {
      role: "system",
      content:
        "You are an AI writing assistant that continues existing text based on context from prior text. " +
        "Give more weight/priority to the later characters than the beginning ones. " +
        "Limit your response to no more than 200 characters, but make sure to construct complete sentences.",
      // we're disabling markdown for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
      // "Use Markdown formatting when appropriate.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];
  const model = "gpt-3.5-turbo";
  const response = await openai.createChatCompletion({
    model,
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  // If the response is unauthorized, return a 401 error
  if (response.status === 401) {
    return new Response("Error: You are unauthorized to perform this action", {
      status: 401,
    });
  }
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
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
          ],
        }),
      );
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
