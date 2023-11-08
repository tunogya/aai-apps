import { Configuration, OpenAIApi } from "openai-edge";
import { SQSClient } from "@aws-sdk/client-sqs";
import redisClient from "@/utils/redisClient";
import { AI_MODELS_MAP } from "@/utils/aiModels";

const sqsClient = new SQSClient({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const runtime = "edge";

const FEE_RATE = 0.3;

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

  const config = await req.json();

  const hash = await calculateHash(JSON.stringify(config.messages));
  const cache = await redisClient.get(hash);
  if (cache) {
    await redisClient.expire(hash, 60 * 60 * 24 * 7);

    return new Response(JSON.stringify(cache), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
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

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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

async function calculateHash(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
