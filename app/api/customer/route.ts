import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";
import redisClient from "@/app/utils/redisClient";

const GET = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
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
        name: "AbandonAI Free",
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
        name: "Premium Max",
        isPremium: true,
      },
    };
    await redisClient.set(`premium:${user.sub}`, JSON.stringify(data), {
      exat: new Date(premium_max_expired).getTime() / 1000,
    });
    return NextResponse.json(data);
  }

  if (premium_pro_expired && new Date(premium_pro_expired) > new Date()) {
    const data = {
      customer: customer,
      subscription: {
        name: "Premium Pro",
        isPremium: true,
      },
    };
    await redisClient.set(`premium:${user.sub}`, JSON.stringify(data), {
      exat: new Date(premium_pro_expired).getTime() / 1000,
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
        name: "Premium Standard",
        isPremium: true,
      },
    };
    await redisClient.set(`premium:${user.sub}`, JSON.stringify(data), {
      exat: new Date(premium_pro_expired).getTime() / 1000,
    });
    return NextResponse.json(data);
  }

  const subscriptions = await stripeClient.subscriptions.list({
    customer: customer.id,
    status: "active",
  });

  if (
    subscriptions.data.some((sub) =>
      sub.items.data.some(
        (item) => item.plan.product === process.env.PREMIUM_STANDARD_PRODUCT,
      ),
    )
  ) {
    const data = {
      customer: customer,
      subscription: {
        name: "Premium Standard",
        isPremium: true,
      },
    };
    await redisClient.set(`premium:${user.sub}`, JSON.stringify(data), {
      ex: 86400,
    });
    return NextResponse.json(data);
  } else {
    await redisClient.set(`premium:${user.sub}`, false, {
      ex: 86400,
    });
    return NextResponse.json({
      customer: customer,
      subscription: {
        name: "AbandonAI Free",
        isPremium: false,
      },
    });
  }
};

export { GET };
