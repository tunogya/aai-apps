import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { input } = await req.json();

  const openai = new OpenAI();

  const { results } = await openai.moderations.create({
    input: input,
    model: "text-moderation-latest",
  });

  return NextResponse.json(results?.[0]);
}
