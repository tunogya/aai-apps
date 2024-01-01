import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";
import redisClient from "@/app/utils/redisClient";
import Stripe from "stripe";

const GET = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();

  // get data from cache, if exists, must be premium user
  const customer = await redisClient.get(`customer:${user.email}`);
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
    return NextResponse.json({
      error: "email required",
      message: "Please use email to login.",
    });
  }

  let subscription: Stripe.Subscription | null;

  subscription = await redisClient.get(`subscription:${user.email}`);

  if (subscription) {
    if (
      !subscription.items.data.some(
        (item) => item.price.id === process.env.NEXT_PUBLIC_GPT_4_INPUT_PRICE,
      )
    ) {
      await stripeClient.subscriptionItems.create({
        subscription: subscription.id,
        price: process.env.NEXT_PUBLIC_GPT_4_INPUT_PRICE,
      });
    }
    if (
      !subscription.items.data.some(
        (item) => item.price.id === process.env.NEXT_PUBLIC_GPT_4_OUTPUT_PRICE,
      )
    ) {
      await stripeClient.subscriptionItems.create({
        subscription: subscription.id,
        price: process.env.NEXT_PUBLIC_GPT_4_OUTPUT_PRICE,
      });
    }
    if (
      !subscription.items.data.some(
        (item) => item.price.id === process.env.NEXT_PUBLIC_GPT_3_5_INPUT_PRICE,
      )
    ) {
      await stripeClient.subscriptionItems.create({
        subscription: subscription.id,
        price: process.env.NEXT_PUBLIC_GPT_3_5_INPUT_PRICE,
      });
    }
    if (
      !subscription.items.data.some(
        (item) =>
          item.price.id === process.env.NEXT_PUBLIC_GPT_3_5_OUTPUT_PRICE,
      )
    ) {
      await stripeClient.subscriptionItems.create({
        subscription: subscription.id,
        price: process.env.NEXT_PUBLIC_GPT_3_5_OUTPUT_PRICE,
      });
    }
    if (
      !subscription.items.data.some(
        (item) => item.price.id === process.env.NEXT_PUBLIC_DALLE_3_PRICE,
      )
    ) {
      await stripeClient.subscriptionItems.create({
        subscription: subscription.id,
        price: process.env.NEXT_PUBLIC_DALLE_3_PRICE,
      });
    }
  }
  await redisClient.set(
    `subscription:${user.email}`,
    JSON.stringify(subscription),
  );
  return NextResponse.json(subscription);
};

const POST = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
  // get data from cache, if exists, must be premium user
  const customer = await redisClient.get(`customer:${user.email}`);
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
    return NextResponse.json({
      error: "email required",
      message: "Please use email to login.",
    });
  }

  const cache = await redisClient.get(`subscription:${user.email}`);

  if (cache) {
    return NextResponse.json(cache);
  } else {
    const subscription = await stripeClient.subscriptions.create({
      // @ts-ignore
      customer: customer.id,
      description: "Pay as you go",
      items: [
        {
          price: process.env.NEXT_PUBLIC_GPT_4_INPUT_PRICE,
        },
        {
          price: process.env.NEXT_PUBLIC_GPT_4_OUTPUT_PRICE,
        },
        {
          price: process.env.NEXT_PUBLIC_GPT_3_5_INPUT_PRICE,
        },
        {
          price: process.env.NEXT_PUBLIC_GPT_3_5_OUTPUT_PRICE,
        },
        {
          price: process.env.NEXT_PUBLIC_DALLE_3_PRICE,
        },
      ],
      billing_thresholds: {
        amount_gte: 2000,
        reset_billing_cycle_anchor: true,
      },
    });
    await redisClient.set(`subscription:${user.email}`, subscription);
    return NextResponse.json(subscription);
  }
};

export { GET, POST };
