import OpenAI from "openai";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import * as json from "multiformats/codecs/json";
import { sha256 } from "multiformats/hashes/sha2";
import { CID } from "multiformats/cid";
import redisClient from "@/app/utils/redisClient";
import getRateLimitConfig from "@/app/utils/getRateLimitConfig";

export const runtime = "edge";

// @ts-ignore
export async function POST(req: NextRequest): Promise<Response> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  const prefix = "ratelimit:/api/chat/recommend";
  const { ratelimit, content_window } = getRateLimitConfig(prefix, null);

  const { success, limit, remaining, reset } = await ratelimit.limit(sub);
  if (!success) {
    return NextResponse.json([]);
  }

  const { history } = await req.json();

  const bytes = json.encode(history);
  const hash = await sha256.digest(bytes);
  const cid = CID.create(1, json.code, hash).toString();

  const cache = await redisClient.get(`recommend:${cid}`);
  // @ts-ignore
  if (cache && cache?.length > 0) {
    return NextResponse.json(cache);
  }

  try {
    try {
      const openai = new OpenAI();
      const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            role: "system",
            content: `You are a robot that can guess the questions that users are most likely interested in based on their previous browsing history. Provide 2-4 questions and reply using JSON format. For example, {questions: [{content: 'foo1'}...]}`,
          },
          {
            role: "user",
            content: `My previous query history: ${JSON.stringify(
              history,
            )}, Please provide 2-4 questions that users are most likely interested in and reply using JSON format.`,
          },
        ],
        response_format: {
          type: "json_object",
        },
        temperature: 0.7,
        stream: false,
        max_tokens: 256,
      });
      const jsonStr = res.choices[0].message.content;
      try {
        const resJson = JSON.parse(jsonStr || "[]")?.questions || [];
        if (history && history.length > 0) {
          await redisClient.set(`recommend:${cid}`, resJson, {
            ex: 86400,
          });
        } else {
          await redisClient.set(`recommend:${cid}`, resJson, {
            ex: 3 * 60,
          });
        }
        return NextResponse.json(resJson);
      } catch (e) {
        return NextResponse.json([]);
      }
    } catch (e) {
      return NextResponse.json([]);
    }
  } catch (e) {
    return NextResponse.json([]);
  }
}
