import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";
import redisClient from "@/app/utils/redisClient";

const GET = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;
  const customer = await redisClient.get(`customer:${sub}`);

  if (!customer) {
    return NextResponse.json({
      error: "customer required",
      message: "You need to be a customer.",
    });
  }

  const upcomingInvoice = await stripeClient.invoices.retrieveUpcoming({
    // @ts-ignore
    customer: customer.id,
  });

  return NextResponse.json(upcomingInvoice);
};

export { GET };
