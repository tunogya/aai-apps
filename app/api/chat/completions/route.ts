import redisClient from "@/app/utils/redisClient";
import OpenAI from "openai";
import calculateHash from "@/app/utils/calculateHash";

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

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const res = await openai.chat.completions.create(config);
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
