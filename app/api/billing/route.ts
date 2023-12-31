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
  const customer = await redisClient.get(`customer:${sub}`);

  if (!customer) {
    return NextResponse.json({
      error: "customer required",
      message: "You need to be a customer.",
    });
  }
  // @ts-ignore
  if (customer && customer?.id) {
    // @ts-ignore
    customer_id = customer?.id;
  } else {
    if (!user.email) {
      return NextResponse.json({
        error: "email required",
        message: "Please use email to login.",
      });
    }
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
