import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

const GET = async (req: NextRequest) => {
  const session = await getSession();
  const sub = session?.user.sub;

  return NextResponse.json({
    cost: {
      today: 10,
      yesterday: 5,
    },
    estimate: {
      month: 20,
    },
    advance_pay: {
      balance: 100,
      status: "NORMAL",
    },
  });
};

export { GET };
