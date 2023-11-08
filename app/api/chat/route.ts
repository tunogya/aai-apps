import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { SendMessageBatchCommand, SQSClient } from "@aws-sdk/client-sqs";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@auth0/nextjs-auth0/edge";

const sqsClient = new SQSClient({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const runtime = "edge";

// @ts-ignore
export async function POST(req: Request): Promise<Response> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  let { messages, model, id } = await req.json();

  messages.slice(-16);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const res = await openai.createChatCompletion({
      model,
      messages,
      temperature: 0.7,
      stream: true,
      max_tokens: 1024,
    });

    const stream = OpenAIStream(res, {
      async onCompletion(completion) {
        await sqsClient.send(
          new SendMessageBatchCommand({
            QueueUrl: process.env.AI_DB_UPDATE_SQS_FIFO_URL,
            Entries: [
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
                    ":title": messages[0]?.content?.slice(0, 40) || "Title",
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
