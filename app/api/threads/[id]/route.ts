import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import openai from "@/app/utils/openai";

const GET = async (req: NextRequest, { params }: any) => {
  const session = await getSession();

  const thread = await openai.beta.threads.retrieve(params.id);

  return NextResponse.json(thread);
};

export { GET };
