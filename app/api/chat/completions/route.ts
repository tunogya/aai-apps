import { Configuration, OpenAIApi } from "openai-edge";
import redisClient from "@/app/utils/redisClient";

export const runtime = "edge";

// @ts-ignore
export async function POST(req: Request): Promise<Response> {
  const bearerToken = req.headers.get("Authorization");
  if (!bearerToken) {
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

async function calculateHash(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
