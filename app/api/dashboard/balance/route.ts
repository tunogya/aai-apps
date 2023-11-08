import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";

export const runtime = "edge";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  return NextResponse.json({
    balance: 0,
    credit: 0,
  });
};

export { GET };
