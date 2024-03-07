import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";
import { Redis } from "@upstash/redis";

const GET = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();

  if (!user.email) {
    return NextResponse.json({
      error: "email required",
      message: "Please use email to login.",
    });
  }

  const redis = Redis.fromEnv();
  const cache = await redis.get(`emailToCid:${user.email}`);

  let customer: any;

  if (cache) {
    customer = await stripeClient.customers.retrieve(cache as string);
  } else {
    const customers = await stripeClient.customers.list({
      email: user.email,
    });
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripeClient.customers.create({
        email: user.email,
        name: user.nickname,
        metadata: {
          id: user.sub,
        },
      });
      customer = {
        ...customer,
        balance: 0,
        currency: "usd",
      };
    }
    await redis.set(`emailToCid:${user.email}`, customer.id);
  }

  if (customer?.currency !== "usd") {
    const balanceTransactions =
      await stripeClient.customers.listBalanceTransactions(customer.id, {
        limit: 5,
      });
    const usdTransactions = balanceTransactions.data.filter(
      (item) => item.currency === "usd",
    );
    if (usdTransactions.length > 0) {
      const usdBalance = usdTransactions[0].ending_balance;
      customer = {
        ...customer,
        balance: usdBalance,
        currency: "usd",
      };
    } else {
      customer = {
        ...customer,
        balance: 0,
        currency: "usd",
      };
    }
  }

  return NextResponse.json(customer);
};

export { GET };
