import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";
import redisClient from "@/app/utils/redisClient";
import Stripe from "stripe";
import * as process from "process";

const GET = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();

  // get data from cache, if exists, must be premium user
  const cache = await redisClient.get(`customer:${user.sub}`);
  // @ts-ignore
  if (cache) {
    try {
      return NextResponse.json({
        ...cache,
        cache: true,
      });
    } catch (e) {
      console.log("cache error", e);
    }
  }

  if (!user.email) {
    return NextResponse.json(
      {
        error: "email required",
        message: "Please use email to login.",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1",
          "CDN-Cache-Control": "public, s-maxage=60",
          "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
        },
      },
    );
  }

  let customer: Stripe.Customer, subscription: Stripe.Subscription;
  const customers = await stripeClient.customers.list({
    email: user.email,
  });
  if (customers.data.length === 0) {
    customer = await stripeClient.customers.create({
      email: user.email,
      name: user.nickname,
      metadata: {
        id: user.sub,
      },
    });
  } else {
    customer = customers.data[0];
  }

  const subscriptions = await stripeClient.subscriptions.list({
    customer: customer.id,
    status: "active",
  });

  const filter_subscriptions = subscriptions.data.filter((sub) => {
    return sub.items.data.some(
      (item) => item.plan.product === process.env.NEXT_PUBLIC_AAI_CREDIT_PRICE,
    );
  });

  if (filter_subscriptions.length > 0) {
    subscription = filter_subscriptions[0];
  } else {
    subscription = await stripeClient.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: process.env.NEXT_PUBLIC_AAI_CREDIT_PRICE,
        },
      ],
    });
  }
  const data = {
    customer,
    subscription,
  };
  await redisClient.set(`customer:${user.sub}`, JSON.stringify(data));
  return NextResponse.json(data);
};

export { GET };
