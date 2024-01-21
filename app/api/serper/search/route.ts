import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import redisClient from "@/app/utils/redisClient";
import stripeClient from "@/app/utils/stripeClient";

export const runtime = "edge";

// @ts-ignore
export async function POST(req: NextRequest): Promise<NextResponse> {
  // @ts-ignore
  const { user } = await getSession();
  const customer = await redisClient.get(`customer:${user.email}`);
  let balance = await redisClient.get(`customer:balance:${user.email}`);
  if (!balance) {
    balance = 0;
  }

  if (!customer) {
    return NextResponse.json({
      error: "customer required",
      message: "You need to be a customer.",
    });
  }

  if ((balance as number) > 5) {
    return NextResponse.json(
      {
        error: "Insufficient balance",
        message: "You need to recharge before using it.",
      },
      {
        status: 402,
      },
    );
  }

  let { q, num = 10 } = await req.json();

  try {
    const data = await fetch(`https://google.serper.dev/search`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.SERPER_API_KEY!,
      },
      body: JSON.stringify({
        q,
        num,
      }),
    }).then((res) => res.json());

    let cost,
      baseRatio = 2;
    if (num > 10) {
      cost = 0.005 * 2 * baseRatio;
    } else {
      cost = 0.005 * baseRatio;
    }

    await Promise.all([
      // @ts-ignore
      stripeClient.customers.createBalanceTransaction(customer.id, {
        amount: Math.round((cost || 0) * 100),
        currency: "usd",
      }),
      redisClient.incrbyfloat(
        `customer:balance:${user.email}`,
        Math.round((cost || 0) * 100),
      ),
    ]);

    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
