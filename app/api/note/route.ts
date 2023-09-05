import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

const GET = withApiAuthRequired(async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;
  return NextResponse.json({});
});

export { GET };
