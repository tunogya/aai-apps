import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/utils/stripeClient";
import redisClient from "@/utils/redisClient";

const POST = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
  try {
    const session = await stripeClient.checkout.sessions.create({
      line_items: [
        {
          price: "price_1NtMGxFPpv8QfieYD2d3FSwe",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.nextUrl.origin}/?success=true`,
      cancel_url: `${req.nextUrl.origin}/?canceled=true`,
      automatic_tax: { enabled: true },
      customer_email: user?.email || undefined,
      metadata: {
        id: user.sub,
      },
    });
    const id = session.id;
    await redisClient.set(id, "price_1NtMGxFPpv8QfieYD2d3FSwe");
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
