import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/utils/stripeClient";
import redisClient from "@/utils/redisClient";

const POST = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
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
      line_items: [
        {
          price: "price_1NtMGxFPpv8QfieYD2d3FSwe",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.nextUrl.origin}/pay/success`,
      cancel_url: `${req.nextUrl.origin}/pay/error?error=Canceled`,
      automatic_tax: { enabled: true },
      customer: customer,
    });
    const id = session.id;
    await redisClient.set(id, "price_1NtMGxFPpv8QfieYD2d3FSwe", {
      ex: 60 * 60 * 24,
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
