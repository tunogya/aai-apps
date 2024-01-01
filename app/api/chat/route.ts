import {
  experimental_StreamData,
  OpenAIStream,
  StreamingTextResponse,
  Message,
} from "ai";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import dysortid from "@/app/utils/dysortid";
import redisClient from "@/app/utils/redisClient";
import getRateLimitConfig from "@/app/utils/getRateLimitConfig";
import ddbDocClient from "@/app/utils/ddbDocClient";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import openai from "@/app/utils/openai";
import stripeClient from "@/app/utils/stripeClient";
import Stripe from "stripe";

export const runtime = "edge";

// @ts-ignore
export async function POST(req: NextRequest): Promise<Response> {
  // @ts-ignore
  const { user } = await getSession();

  const customer = await redisClient.get(`customer:${user.email}`);

  if (!customer) {
    return NextResponse.json({
      error: "customer required",
      message: "You need to be a customer.",
    });
  }

  // @ts-ignore
  if (customer?.balance > 50) {
    return NextResponse.json(
      {
        error: "Insufficient balance",
        message: "You need to recharge before using it.",
      },
      {
        status: 402,
      },
    );
  }

  let { messages, model, id, functions } = await req.json();

  // get title before json parse messages content
  let title = messages[0]?.content.slice(0, 40);
  const useVision = model === "gpt-4-vision";
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

  // only handle the last 4 messages
  messages?.slice(-4);

  let prefix: string, i_si_id: string, o_si_id: string;
  if (model.startsWith("gpt-4")) {
    prefix = "ratelimit:/api/chat:gpt-4";
  } else if (model.startsWith("gpt-3.5")) {
    prefix = "ratelimit:/api/chat:gpt-3.5";
  } else {
    return new Response(
      JSON.stringify({
        error: 404,
        message: "model error",
      }),
      {
        status: 429,
      },
    );
  }
  const ratelimit = getRateLimitConfig(prefix);

  const { success, limit, reset, remaining } = await ratelimit.limit(
    user.email,
  );
  if (!success) {
    return new Response(
      JSON.stringify({
        error: 429,
        message: "ratelimit reached",
        ratelimit: {
          limit,
          reset: new Date(reset).toLocaleString(),
          remaining,
        },
      }),
      {
        status: 429,
      },
    );
  }

  try {
    let res;
    try {
      // Priority model
      if (model === "gpt-3.5") {
        model = "gpt-3.5-turbo-1106"; // 16k tokens
      } else if (model === "gpt-4") {
        model = "gpt-4-1106-preview"; // 128k tokens
      } else if (model === "gpt-4-vision") {
        model = "gpt-4-vision-preview"; // 128k tokens
      }
      res = await openai.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        stream: true,
        functions,
      });
    } catch (e) {
      // Backup model
      if (model === "gpt-3") {
        model = "gpt-3.5-turbo"; // 4k tokens
      } else if (model === "gpt-4") {
        model = "gpt-4"; // 8k tokens
      } else if (model === "gpt-4-vision") {
        model = "gpt-4-vision-preview"; // 8k tokens
      }
      res = await openai.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        stream: true,
        functions,
      });
    }

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
        const { cost } = await fetch("https://api.abandon.ai/tiktoken", {
          method: "POST",
          body: JSON.stringify({
            prompt: messages.map((m: any) => m.content).join("\n"),
            completion: completion,
            model: model,
          }),
        })
          .then((res) => res.json())
          .catch((e) => {
            console.log("Unable to create charge", e);
          });
        const pendingPromise = [
          data.close(),
          ddbDocClient.send(
            new UpdateCommand({
              TableName: "abandonai-prod",
              Key: {
                PK: `USER#${user.sub}`,
                SK: `CHAT2#${id}`,
              },
              ExpressionAttributeNames: {
                "#messages": "messages",
                "#updated": "updated",
                "#title": "title",
              },
              ExpressionAttributeValues: {
                ":empty_list": [],
                ":messages": list_append.map((m) => ({
                  ...m,
                  createdAt: m.createdAt?.toISOString(),
                })),
                ":updated": Math.floor(Date.now() / 1000),
                ":title": title,
              },
              UpdateExpression:
                "SET #messages = list_append(if_not_exists(#messages, :empty_list), :messages), #updated = :updated, #title = :title",
            }),
          ),
          redisClient.del(`USER#${user.sub}:CHAT2#${id}`),
        ];
        if (cost?.total_cost > 0) {
          pendingPromise.push(
            // @ts-ignore
            stripeClient.customers.createBalanceTransaction(customer.id, {
              amount: Math.floor((cost?.total_cost || 0) * 100),
              currency: "usd",
            }),
          );
        }
        await Promise.all(pendingPromise);
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
