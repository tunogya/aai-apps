import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";
import redisClient from "@/app/utils/redisClient";
import Stripe from "stripe";

const GET = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();

  const customer = await redisClient.get(`customer:${user.email}`);

  if (!customer) {
    return NextResponse.json({
      error: "customer required",
      message: "You need to be a customer.",
    });
  }

  // @ts-ignore
  const balanceTransactions =
    await stripeClient.customers.listBalanceTransactions(customer.id, {
      limit: 20,
    });

  return NextResponse.json(
    balanceTransactions.data.filter((item) => item.currency === "usd"),
  );
};

export { GET };
