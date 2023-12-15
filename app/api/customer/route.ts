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
  const isPremium = await redisClient.get(`premium:${user.sub}`);
  // @ts-ignore
  if (isPremium?.subscription) {
    try {
      return NextResponse.json({
        ...isPremium,
        cache: true,
      });
    } catch (e) {
      console.log("cache error", e);
    }
  }

  const customers = await stripeClient.customers.list({
    email: user.email,
  });
  if (customers.data.length === 0) {
    const customer = await stripeClient.customers.create({
      email: user.email,
      name: user.nickname,
      metadata: {
        id: user.sub,
      },
    });
    await redisClient.set(`premium:${user.sub}`, false, {
      ex: 86400,
    });
    return NextResponse.json({
      customer: customer,
      subscription: {
        product: "AbandonAI Free",
        isPremium: false,
      },
    });
  }
  const customer = customers.data[0];

  const premium_standard_expired = customer.metadata?.premium_standard_expired;
  const premium_pro_expired = customer.metadata?.premium_pro_expired;
  const premium_max_expired = customer.metadata?.premium_max_expired;

  if (premium_max_expired && new Date(premium_max_expired) > new Date()) {
    const data = {
      customer: customer,
      subscription: {
        isPremium: true,
        product: process.env.PREMIUM_MAX_PRODUCT,
        current_period_end: new Date(premium_max_expired).getTime() / 1000,
      },
    };
    await redisClient.set(`premium:${user.sub}`, JSON.stringify(data), {
      exat: Number((new Date(premium_max_expired).getTime() / 1000).toFixed(0)),
    });
    return NextResponse.json(data);
  }

  if (premium_pro_expired && new Date(premium_pro_expired) > new Date()) {
    const data = {
      customer: customer,
      subscription: {
        isPremium: true,
        product: process.env.PREMIUM_PRO_PRODUCT,
        current_period_end: new Date(premium_pro_expired).getTime() / 1000,
      },
    };
    await redisClient.set(`premium:${user.sub}`, JSON.stringify(data), {
      exat: Number((new Date(premium_pro_expired).getTime() / 1000).toFixed(0)),
    });
    return NextResponse.json(data);
  }

  if (
    premium_standard_expired &&
    new Date(premium_standard_expired) > new Date()
  ) {
    const data = {
      customer: customer,
      subscription: {
        isPremium: true,
        product: process.env.PREMIUM_STANDARD_PRODUCT,
        current_period_end: new Date(premium_standard_expired).getTime() / 1000,
      },
    };
    await redisClient.set(`premium:${user.sub}`, JSON.stringify(data), {
      exat: Number(
        (new Date(premium_standard_expired).getTime() / 1000).toFixed(0),
      ),
    });
    return NextResponse.json(data);
  }

  const subscriptions = await stripeClient.subscriptions.list({
    customer: customer.id,
    status: "active",
  });

  const filter_subscriptions = subscriptions.data.filter((sub) => {
    return sub.items.data.some(
      (item) =>
        item.plan.product === process.env.PREMIUM_STANDARD_PRODUCT ||
        item.plan.product === process.env.PREMIUM_PRO_PRODUCT ||
        item.plan.product === process.env.PREMIUM_MAX_PRODUCT,
    );
  });

  if (filter_subscriptions.length > 0) {
    const subscription = filter_subscriptions[0] as Stripe.Subscription;
    const data = {
      customer: customer,
      subscription: {
        isPremium: subscription.status === "active",
        product: subscription.items.data[0].plan.product,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
      },
    };
    await redisClient.set(`premium:${user.sub}`, JSON.stringify(data), {
      exat: subscription.current_period_end,
    });
    return NextResponse.json(data);
  } else {
    return NextResponse.json({
      customer: customer,
      subscription: {
        product: "AbandonAI Free",
        isPremium: false,
      },
    });
  }
};

export { GET };
