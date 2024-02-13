import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import OpenAI from "openai";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  const openai = new OpenAI();
  const list = await openai.beta.assistants.list({
    limit: 10,
    order: "desc",
  });
  return NextResponse.json(list.data);
};

export { GET };
