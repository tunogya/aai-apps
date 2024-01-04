import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";
import redisClient from "@/app/utils/redisClient";
import Stripe from "stripe";

const GET = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();

  if (!user.email) {
    return NextResponse.json({
      error: "email required",
      message: "Please use email to login.",
    });
  }

  let customer: Stripe.Customer;
  const customers = await stripeClient.customers.list({
    email: user.email,
  });
  if (customers.data.length > 0) {
    customer = customers.data[0];
    if (customer.currency !== "usd") {
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
  redisClient
    .pipeline()
    .set(`customer:balance:${user.email}`, customer.balance)
    .set(`customer:${user.email}`, JSON.stringify(customer));
  return NextResponse.json(customer);
};

export { GET };
