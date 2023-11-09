import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/utils/stripeClient";
import redisClient from "@/utils/redisClient";

const GET = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
  const cache = await redisClient.get(`${user.sub}:/api/billing`);
  if (cache) {
    return NextResponse.json({
      session: cache,
    });
  }

  const customers = await stripeClient.customers.list({
    email: user.email,
  });
  let customer;
  if (customers.data.length === 0) {
    const { id } = await stripeClient.customers.create({
      email: user.email,
      name: user.nickname,
      metadata: {
        id: user.sub,
      },
    });
    customer = id;
  } else {
    customer = customers.data[0].id;
  }
  const session = await stripeClient.billingPortal.sessions.create({
    customer: customer,
    return_url: "https://app.abandon.ai",
  });

  await redisClient.set(`${user.sub}:/api/billing`, JSON.stringify(session));

  return NextResponse.json({
    session: session,
  });
};

export { GET };
