import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  return NextResponse.json({});
};

export { GET };
