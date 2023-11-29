import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";

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
      subscription: {
        name: "AbandonAI Free",
        isPremium: false,
      },
    });
  }
  const customer = customers.data[0];

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
    return NextResponse.json({
      customer: customer,
      subscription: {
        name: "Premium Standard",
        isPremium: true,
      },
    });
  } else {
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
