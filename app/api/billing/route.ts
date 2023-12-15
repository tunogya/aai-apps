import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import stripeClient from "@/app/utils/stripeClient";
import dysortid from "@/app/utils/dysortid";
import redisClient from "@/app/utils/redisClient";

const POST = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;
  let customer_id;
  const premiumInfo = await redisClient.get(`premium:${sub}`);
  // @ts-ignore
  if (premiumInfo && premiumInfo?.customer?.id) {
    // @ts-ignore
    customer_id = premiumInfo?.customer?.id;
  } else {
    const customers = await stripeClient.customers.list({
      email: user.email,
    });
    if (customers.data.length === 0) {
      const { id } = await stripeClient.customers.create({
        email: user.email,
        name: user.nickname,
        metadata: {
          id: user.sub,
        },
      });
      customer_id = id;
    } else {
      customer_id = customers.data[0].id;
    }
  }
  try {
    const session = await stripeClient.billingPortal.sessions.create({
      customer: customer_id,
      return_url: req.nextUrl.origin + `/chat/${dysortid()}`,
    });
    return NextResponse.json({
      session: session,
    });
  } catch (e) {
    return NextResponse.json({
      error: "something went wrong",
      message: e,
    });
  }
};

export { POST };
