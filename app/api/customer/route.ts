import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";
import redisClient from "@/app/utils/redisClient";
import Stripe from "stripe";

const GET = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();

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

  let customer: Stripe.Customer;
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
  }
  await redisClient.set(`customer:${user.email}`, JSON.stringify(customer));
  return NextResponse.json(customer);
};

export { GET };
