import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";
import redisClient from "@/app/utils/redisClient";
import Stripe from "stripe";

const GET = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();

  // get data from cache, if exists, must be premium user
  const customer = await redisClient.get(`customer:${user.sub}`);
  // @ts-ignore
  if (!customer || !customer?.id) {
    return NextResponse.json(
      {
        error: "customer not found",
        message: "Please use email to login.",
      },
      {
        status: 404,
      },
    );
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

  let subscription: Stripe.Subscription;

  const subscriptions = await stripeClient.subscriptions.list({
    // @ts-ignore
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
      // @ts-ignore
      customer: customer.id,
      description: "Pay as you go",
      items: [
        {
          price: process.env.NEXT_PUBLIC_GPT_4_AAI_PRICE,
        },
        {
          price: process.env.NEXT_PUBLIC_GPT_3_5_AAI_PRICE,
        },
        {
          price: process.env.NEXT_PUBLIC_DALLE_3_AAI_PRICE,
        },
        {
          price: process.env.NEXT_PUBLIC_AAI_USAGE_PRICE,
        },
      ],
    });
  }
  await redisClient.set(
    `subscription:${user.sub}`,
    JSON.stringify(subscription),
  );
  return NextResponse.json(subscription);
};

export { GET };
