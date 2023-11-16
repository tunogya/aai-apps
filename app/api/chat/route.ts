import {
  experimental_StreamData,
  OpenAIStream,
  StreamingTextResponse,
  Message,
  nanoid,
} from "ai";
import OpenAI from "openai";
import { SendMessageBatchCommand, SQSClient } from "@aws-sdk/client-sqs";
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

  let { messages, model, id, functions } = await req.json();
  let max_tokens = 1024;

  if (model?.startsWith("gpt-4")) {
    max_tokens = 4096;
  } else {
    messages?.slice(-8);
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const list_append: Array<Message> = [];
  list_append.push({
    ...messages[messages.length - 1],
    id: nanoid(),
    createdAt: new Date(),
  });

  try {
    const res = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      stream: true,
      max_tokens,
      functions: functions,
    });
    const data = new experimental_StreamData();
    const stream = OpenAIStream(res, {
      experimental_onFunctionCall: async (
        { name, arguments: args },
        createFunctionCallMessages,
      ) => {
        if (name === "get_current_weather") {
          const weatherData = {
            temperature: 20,
            unit: args.format === "celsius" ? "C" : "F",
          };
          const newMessages = createFunctionCallMessages(weatherData);
          return openai.chat.completions.create({
            messages: [...messages, ...newMessages],
            stream: true,
            model: model,
          });
        }
      },
      async onCompletion(completion) {
        try {
          const { function_call } = JSON.parse(completion);
          const _name = function_call.name;
          list_append.push({
            id: nanoid(),
            createdAt: new Date(),
            role: "assistant",
            name: _name,
            content: "",
            function_call,
          });
        } catch (e) {
          list_append.push({
            id: nanoid(),
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
                    ":messages": list_append,
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
        await data.close();
      },
      experimental_streamData: true,
    });

    return new StreamingTextResponse(stream, {}, data);
  } catch (e) {
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
