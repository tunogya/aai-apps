import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/utils/stripeClient";

const POST = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
  const { line_items, mode, success_url, cancel_url } = await req.json();
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
  try {
    const session = await stripeClient.checkout.sessions.create({
      line_items,
      mode,
      success_url,
      cancel_url,
      automatic_tax: { enabled: true },
      customer: customer,
    });
    return NextResponse.json({
      session: session,
    });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message,
    });
  }
};

export { POST };
