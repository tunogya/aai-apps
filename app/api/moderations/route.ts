import { NextRequest, NextResponse } from "next/server";
import openai from "@/app/utils/openai";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { input } = await req.json();

  const { results } = await openai.moderations.create({
    input: input,
    model: "text-moderation-latest",
  });

  return NextResponse.json(results?.[0], {
    headers: {
      "Cache-Control": "public, s-maxage=1",
      "CDN-Cache-Control": "public, s-maxage=60",
      "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
    },
  });
}
