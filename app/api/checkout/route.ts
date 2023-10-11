import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/utils/stripeClient";
import redisClient from "@/utils/redisClient";

const POST = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
  try {
    const session = await stripeClient.checkout.sessions.create({
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      cancel_url: `${req.nextUrl.origin}/pay/error?error=Canceled`,
      customer_email: user?.email || undefined,
      line_items: [
        {
          price: "price_1NtMGxFPpv8QfieYD2d3FSwe",
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        id: user.sub,
      },
      success_url: `${req.nextUrl.origin}/pay/success`,
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
