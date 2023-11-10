import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/utils/stripeClient";

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
    return NextResponse.json({
      customer: customer,
    });
  }
  return NextResponse.json({
    customer: customers.data[0],
  });
};

export { GET };
